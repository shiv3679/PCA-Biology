import CentralDogma from './molecular/CentralDogma.mdx';
import EnzymeKinetics from './molecular/EnzymeKinetics.mdx';
import PCATheory from './data/PCA.mdx';

export const categories = {
  Molecular: [
    { slug: 'central-dogma', title: 'Central Dogma', Component: CentralDogma },
    { slug: 'enzyme-kinetics', title: 'Enzyme Kinetics', Component: EnzymeKinetics },
  ],
  'Bio-Data Science': [
    { slug: 'pca', title: 'Principal Component Analysis', Component: PCATheory },
  ],
};
