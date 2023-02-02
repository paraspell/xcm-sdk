import { TNode, TNodeDetails } from '../types'

export const NODE_NAMES = [
  'Statemint',
  'Acala',
  'Astar',
  'BifrostPolkadot',
  'Bitgreen',
  'Centrifuge',
  'Clover',
  'ComposableFinance',
  'Darwinia',
  'HydraDX',
  'Interlay',
  'Kylin',
  'Litentry',
  'Moonbeam',
  'Parallel',
  'Statemine',
  'Encointer',
  'Altair',
  'Amplitude',
  'Bajun',
  'Basilisk',
  'BifrostKusama',
  'Pioneer',
  'Calamari',
  'CrustShadow',
  'Crab',
  'Dorafactory',
  'Imbue',
  'Integritee',
  'InvArchTinker',
  'Karura',
  'Kico',
  'Kintsugi',
  'Listen',
  'Litmus',
  'Mangata',
  'Moonriver',
  'ParallelHeiko',
  'Picasso',
  'Pichiu',
  'Quartz',
  'Robonomics',
  'Shiden',
  'Turing'
] as const

// This maps our node names to names which polkadot libs are using
export const nodes: Record<TNode, TNodeDetails> = {
  Statemint: { name: 'statemint', type: 'polkadot' },
  Acala: { name: 'acala', type: 'polkadot' },
  Astar: { name: 'astar', type: 'polkadot' },
  BifrostPolkadot: { name: 'bifrost', type: 'polkadot' },
  Bitgreen: { name: 'bitgreen', type: 'polkadot' },
  Centrifuge: { name: 'centrifuge', type: 'polkadot' },
  Clover: { name: 'clover', type: 'polkadot' },
  ComposableFinance: { name: 'composableFinance', type: 'polkadot' },
  Darwinia: { name: 'darwinia', type: 'polkadot' },
  HydraDX: { name: 'hydra', type: 'polkadot' },
  Interlay: { name: 'interlay', type: 'polkadot' },
  Kylin: { name: 'kylin', type: 'polkadot' },
  Litentry: { name: 'litentry', type: 'polkadot' },
  Moonbeam: { name: 'moonbeam', type: 'polkadot' },
  Parallel: { name: 'parallel', type: 'polkadot' },
  Statemine: { name: 'statemine', type: 'kusama' },
  Encointer: { name: 'encointer', type: 'kusama' },
  Altair: { name: 'altair', type: 'kusama' },
  Amplitude: { name: 'amplitude', type: 'kusama' },
  Bajun: { name: 'bajun', type: 'kusama' },
  Basilisk: { name: 'basilisk', type: 'kusama' },
  BifrostKusama: { name: 'bifrost', type: 'kusama' },
  Pioneer: { name: 'bitcountryPioneer', type: 'kusama' },
  Calamari: { name: 'calamari', type: 'kusama' },
  CrustShadow: { name: 'shadow', type: 'kusama' },
  Crab: { name: 'crab', type: 'kusama' },
  Dorafactory: { name: 'dorafactory', type: 'kusama' },
  Imbue: { name: 'imbue', type: 'kusama' },
  Integritee: { name: 'integritee', type: 'kusama' },
  InvArchTinker: { name: 'tinker', type: 'kusama' },
  Karura: { name: 'karura', type: 'kusama' },
  Kico: { name: 'kico', type: 'kusama' },
  Kintsugi: { name: 'kintsugi', type: 'kusama' },
  Listen: { name: 'listen', type: 'kusama' },
  Litmus: { name: 'litmus', type: 'kusama' },
  Mangata: { name: 'mangata', type: 'kusama' },
  Moonriver: { name: 'moonriver', type: 'kusama' },
  ParallelHeiko: { name: 'heiko', type: 'kusama' },
  Picasso: { name: 'picasso', type: 'kusama' },
  Pichiu: { name: 'pichiu', type: 'kusama' },
  Quartz: { name: 'quartz', type: 'kusama' },
  Robonomics: { name: 'robonomics', type: 'kusama' },
  Shiden: { name: 'shiden', type: 'kusama' },
  Turing: { name: 'turing', type: 'kusama' }
}

export const SUPPORTED_PALLETS = ['XTokens', 'OrmlXTokens', 'PolkadotXcm', 'RelayerXcm'] as const