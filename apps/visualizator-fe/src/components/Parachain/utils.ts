import collectivesPng from '../../logos/collectives.png';
import interlayPng from '../../logos/interlay.png';
import centrifugePng from '../../logos/centrifuge.png';
import zeitgeistPng from '../../logos/zeitgeist.png';
import bitgreenPng from '../../logos/bitgreen.png';
import uniquePng from '../../logos/unique.png';
import acalaPng from '../../logos/acala1.png';
import pendulumPng from '../../logos/pendulum.png';
import mantaPng from '../../logos/manta1.png';
import moonbeamPng from '../../logos/moonbeam1.png';
import subsocialPng from '../../logos/subsocial1.png';
import bifrostPng from '../../logos/bifrost1.png';
import hydrationPng from '../../logos/hydration1.png';
import polkadexPng from '../../logos/polkadex1.png';
import litentryPng from '../../logos/litentry1.png';
import assetHubPng from '../../logos/assetHub1.png';
import astarPng from '../../logos/astar1.png';
import neuroWebPng from '../../logos/neuroWeb1.png';
import phalaPng from '../../logos/phala1.png';
import crustPng from '../../logos/crust1.png';
import composableFinancePng from '../../logos/composableFinance1.png';
import nodlePng from '../../logos/nodle1.png';
import darwiniaPng from '../../logos/darwinia1.png';
import continuumPng from '../../logos/continuum.png';
import aventusPng from '../../logos/aventus.png';
import ajunaPng from '../../logos/ajuna.png';
import frequencyPng from '../../logos/frequency.png';
import hyperbridgePng from '../../logos/hyperbridge.png';
import hashedPng from '../../logos/hashed.png';
import laosPng from '../../logos/laos.png';
import mythosPng from '../../logos/mythos.png';
import polimecPng from '../../logos/polimec.png';
import t3rnPng from '../../logos/t3rn.png';
import soraPng from '../../logos/sora.png';
import logionPng from '../../logos/logion.png';
import curioPng from '../../logos/curio.png';
import krestPng from '../../logos/krest.png';
import ipciPng from '../../logos/ipci.png';
import crabPng from '../../logos/crab.png';
import pioneerPng from '../../logos/pioneer.png';
import { getParachainLogo } from '../../utils/utils';
import { type Ecosystem } from '../../types/types';

export const getNodeLogo = (node: string, ecosystem: Ecosystem) => {
  if (node === 'Collectives') return collectivesPng;
  if (node === 'Interlay') return interlayPng;
  if (node === 'Centrifuge') return centrifugePng;
  if (node === 'Zeitgeist') return zeitgeistPng;
  if (node === 'Bitgreen') return bitgreenPng;
  if (node === 'Unique Network') return uniquePng;
  if (node === 'Acala') return acalaPng;
  if (node === 'Pendulum') return pendulumPng;
  if (node === 'Manta') return mantaPng;
  if (node === 'Moonbeam') return moonbeamPng;
  if (node === 'Subsocial') return subsocialPng;
  if (node === 'Bifrost') return bifrostPng;
  if (node === 'Hydration') return hydrationPng;
  if (node === 'Polkadex') return polkadexPng;
  if (node === 'Litentry') return litentryPng;
  if (node === 'AssetHub') return assetHubPng;
  if (node === 'Astar') return astarPng;
  if (node === 'NeuroWeb') return neuroWebPng;
  if (node === 'Phala Network') return phalaPng;
  if (node === 'Crust') return crustPng;
  if (node === 'Composable Finance') return composableFinancePng;
  if (node === 'Nodle') return nodlePng;
  if (node === 'Darwinia') return darwiniaPng;
  if (node === 'Continuum') return continuumPng;
  if (node === 'Aventus') return aventusPng;
  if (node === 'Ajuna Network') return ajunaPng;
  if (node === 'Frequency') return frequencyPng;
  if (node === 'Hyperbridge (Nexus)') return hyperbridgePng;
  if (node === 'Hashed Network') return hashedPng;
  if (node === 'Laos') return laosPng;
  if (node === 'Mythos') return mythosPng;
  if (node === 'Polimec') return polimecPng;
  if (node === 't3rn') return t3rnPng;
  if (node === 'SORA') return soraPng;
  if (node === 'Logion') return logionPng;
  if (node === 'Curio') return curioPng;
  if (node === 'Krest') return krestPng;
  if (node === 'DAO IPCI') return ipciPng;
  if (node === 'Crab') return crabPng;
  if (node === 'Pioneer') return pioneerPng;
  return getParachainLogo(node, ecosystem);
};

export const getLogoScaleFactor = (node: string) => {
  if (node === 'Bitgreen') return 2.5;
  if (node === 'Unique Network') return 2.5;
  if (node === 'Moonbeam') return 2.5;
  if (node === 'Acala') return 2.5;
  if (node === 'Subsocial') return 2;
  if (node === 'Bifrost') return 2;
  if (node === 'Hydration') return 1.75;
  if (node === 'Polkadex') return 1.75;
  if (node === 'Litentry') return 1.75;
  if (node === 'AssetHub') return 1.75;
  if (node === 'Astar') return 1.75;
  if (node === 'NeuroWeb') return 1.75;
  if (node === 'Phala') return 1.75;
  if (node === 'Crust') return 1.75;
  if (node === 'Composable Finance') return 1.75;
  if (node === 'Nodle') return 1.5;
  if (node === 'Manta') return 2;
  if (node === 'Continuum') return 1.75;
  if (node === 'Aventus') return 1.75;
  if (node === 'Ajuna Network') return 1.75;
  if (node === 'Frequency') return 1.75;
  if (node === 'Hyperbridge (Nexus)') return 1.4;
  if (node === 'Hashed Network') return 2;
  if (node === 'Laos') return 2;
  if (node === 'Mythos') return 1.5;
  if (node === 'Polimec') return 1.5;
  if (node === 't3rn') return 2;
  if (node === 'SORA') return 2;
  if (node === 'Logion') return 2;
  if (node === 'Curio') return 2;
  if (node === 'Krest') return 2;
  if (node === 'DAO IPCI') return 2;
  if (node === 'Crab') return 2;
  if (node === 'Pioneer') return 2;
  return 3;
};
