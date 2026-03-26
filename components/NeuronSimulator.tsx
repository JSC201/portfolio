'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts'

type Preset = 'normal' | 'epileptic' | 'phenytoin' | 'ketamine'

interface SimParams {
  gNa: number
  gK: number
  gCa: number
  gNMDA: number
  gLeak: number
  iApp: number
  tStart: number
  tEnd: number
  vm0: number
  phenytoinEffect: boolean
}

const PRESETS: Record<Preset, SimParams> = {
  normal: {
    gNa: 100, gK: 45, gCa: 0.3, gNMDA: 0.15, gLeak: 0.3,
    iApp: 100, tStart: 100, tEnd: 500, vm0: -62, phenytoinEffect: false,
  },
  epileptic: {
    gNa: 160, gK: 18, gCa: 0.4, gNMDA: 0.25, gLeak: 0.1,
    iApp: 200, tStart: 100, tEnd: 800, vm0: -62, phenytoinEffect: false,
  },
  phenytoin: {
    gNa: 120, gK: 18, gCa: 0.12, gNMDA: 0.25, gLeak: 0.1,
    iApp: 200, tStart: 100, tEnd: 800, vm0: -65, phenytoinEffect: true,
  },
  ketamine: {
    gNa: 160, gK: 18, gCa: 0.2, gNMDA: 0.1, gLeak: 0.1,
    iApp: 200, tStart: 100, tEnd: 800, vm0: -65, phenytoinEffect: false,
  },
}

function simulate(p: SimParams): { trace: { t: number; v: number }[]; spikes: number } {
  const dt = 0.01
  const N = 100000 // 1000 ms
  const SKIP = 50  // 2000 display points

  const Cm = 0.75
  const ENa = 50, EK = -90, ECa = 120, ENMDA = 0, Eleak = -70
  const threshold = -55

  let Vm = p.vm0
  let mNa = 0.0749, hNa = 0.4889, nKd = 0.3645, MCa = 0.3086, NMDAopen = 0.2315

  const trace: { t: number; v: number }[] = []
  let spikes = 0
  let prevVm = Vm

  for (let i = 0; i < N; i++) {
    const t = i * dt
    const iApp = t > p.tStart && t < p.tEnd ? p.iApp : 0

    // Na kinetics (HH)
    const am = 0.1 * (Vm + 40.0001) / (1 - Math.exp(-0.1 * (Vm + 40.0001)))
    const bm = 4 * Math.exp(-0.0556 * (Vm + 65.0001))
    const mInf = am / (am + bm)
    const taum = 1 / (am + bm)

    const ah = 0.07 * Math.exp(-0.05 * (Vm + 65.0001))
    const bh = 1 / (1 + Math.exp(-0.1 * (Vm + 35.0001)))
    const hInf = ah / (ah + bh)
    let tauh = 1 / (ah + bh)
    if (p.phenytoinEffect) tauh *= 1.5

    // K kinetics (HH)
    const an = 0.01 * (Vm + 55.0001) / (1 - Math.exp(-0.1 * (Vm + 55.0001)))
    const bn = 0.125 * Math.exp(-0.0125 * (Vm + 65.0001))
    const nInf = an / (an + bn)
    const taun = 1 / (an + bn)

    // Ca kinetics (Connors)
    const mCaInf = 1 / (1 + Math.exp(-(Vm + 57) / 6.2))
    const tauCa = 0.612 + 1 / (Math.exp(-(Vm + 132) / 16.7) + Math.exp((Vm + 16.8) / 18.2))

    // NMDA kinetics (Connors)
    const nmdaInf = 1 / (1 + Math.exp(-(Vm + 50) / 10))

    // Update gating variables (exponential integration)
    mNa = mInf - (mInf - mNa) * Math.exp(-dt / taum)
    hNa = hInf - (hInf - hNa) * Math.exp(-dt / tauh)
    nKd = nInf - (nInf - nKd) * Math.exp(-dt / taun)
    MCa = mCaInf - (mCaInf - MCa) * Math.exp(-dt / tauCa)
    NMDAopen = nmdaInf - (nmdaInf - NMDAopen) * Math.exp(-dt / 50)

    // Ionic currents
    const INa = p.gNa * mNa ** 3 * hNa * (Vm - ENa)
    const IK  = p.gK  * nKd ** 4 * (Vm - EK)
    const ICa = p.gCa * MCa ** 2 * (Vm - ECa)
    const INMDA = p.gNMDA * NMDAopen * (Vm - ENMDA)
    const IL  = p.gLeak * (Vm - Eleak)

    Vm = Vm + ((-INa - IK - ICa - INMDA - IL + iApp) / Cm) * dt

    if (prevVm < threshold && Vm >= threshold) spikes++
    prevVm = Vm

    if (i % SKIP === 0) trace.push({ t: Math.round(t), v: +Vm.toFixed(1) })
  }

  return { trace, spikes }
}

const COLORS: Record<Preset, string> = {
  normal:    '#737373',
  epileptic: '#b91c1c',
  phenytoin: '#1d4ed8',
  ketamine:  '#15803d',
}

const LABELS: Record<Preset, string> = {
  normal:    'Normal',
  epileptic: 'Epileptic',
  phenytoin: 'Phenytoin',
  ketamine:  'Ketamine',
}

const DESCRIPTIONS: Record<Preset, string> = {
  normal:    'Control pyramidal neuron with baseline conductances and 100 pA drive.',
  epileptic: '↑ gNa, ↑ gCa, ↑ gNMDA · ↓ gK, ↓ gLeak · 200 pA sustained drive.',
  phenytoin: '↓ gNa, ↓ gCa · prolonged Na inactivation (τh × 1.5) mimicking channel blockade.',
  ketamine:  '↓ gNMDA from 0.25 → 0.1, reducing NMDA-mediated prolonged depolarization.',
}

export default function NeuronSimulator() {
  const [preset, setPreset] = useState<Preset>('normal')
  const [result, setResult] = useState(() => simulate(PRESETS['normal']))

  function handlePreset(p: Preset) {
    setPreset(p)
    setResult(simulate(PRESETS[p]))
  }

  return (
    <div style={{ fontFamily: 'sans-serif', margin: '2rem 0' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(Object.keys(PRESETS) as Preset[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePreset(p)}
            style={{
              padding: '0.35rem 0.9rem',
              fontSize: '0.78rem',
              borderRadius: '0.25rem',
              border: `1.5px solid ${preset === p ? COLORS[p] : '#d4d4d4'}`,
              background: preset === p ? COLORS[p] + '18' : 'transparent',
              color: preset === p ? COLORS[p] : '#888',
              cursor: 'pointer',
              fontFamily: 'sans-serif',
              fontWeight: preset === p ? 600 : 400,
            }}
          >
            {LABELS[p]}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={result.trace} margin={{ top: 8, right: 16, bottom: 24, left: 0 }}>
          <XAxis
            dataKey="t"
            tick={{ fontSize: 10, fill: '#bbb', fontFamily: 'sans-serif' }}
            label={{ value: 'Time (ms)', position: 'insideBottom', offset: -12, fill: '#bbb', fontSize: 10, fontFamily: 'sans-serif' }}
          />
          <YAxis
            domain={[-95, 65]}
            tick={{ fontSize: 10, fill: '#bbb', fontFamily: 'sans-serif' }}
            label={{ value: 'Vm (mV)', angle: -90, position: 'insideLeft', offset: 18, fill: '#bbb', fontSize: 10, fontFamily: 'sans-serif' }}
            width={44}
          />
          <ReferenceLine
            y={-55}
            stroke="#e5e5e5"
            strokeDasharray="4 3"
          />
          <Line
            type="linear"
            dataKey="v"
            stroke={COLORS[preset]}
            dot={false}
            strokeWidth={1.5}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS[preset], lineHeight: 1 }}>
            {result.spikes}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '0.4rem' }}>action potentials</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#aaa', lineHeight: 1.5 }}>
          {DESCRIPTIONS[preset]}
        </div>
      </div>
    </div>
  )
}
