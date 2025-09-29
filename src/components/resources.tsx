export const source_icons: Record<string, string | React.ReactElement> = {
  LINCS_L1000_Chem_Pert_Consensus_Sigs: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  LINCS_L1000_Consensus_Median_Signatures: 'https://cfde-drc.s3.amazonaws.com/assets/img/LINCS-logo.png',
  ARCHS4_IDG_Coexp: 'https://data.cfde.cloud/img/IDG.png',
  GlyGen_Glycosylated_Proteins_2022: 'https://cfde-drc.s3.amazonaws.com/assets/img/glygen.png',
  GTEx_Aging_Signatures_2021: 'https://data.cfde.cloud/img/GTEx.png',
  GTEx_Tissues_V8_2023: 'https://data.cfde.cloud/img/GTEx.png',
  IDG_Drug_Targets_2022: 'https://data.cfde.cloud/img/IDG.png',
  MoTrPAC_Endurance_Trained_Rats_2023: 'https://data.cfde.cloud/img/MoTrPAC.png',
  KOMP2_Mouse_Phenotypes_2022: 'https://data.cfde.cloud/img/KOMP2.svg',
  ChEA_2022: <img className="p-2 bg-gray-400" src="https://maayanlab.cloud/chea3/assets/images/chea3_logo.png" alt="ChEA 2022" />,
  KEA_2015: 'https://maayanlab.cloud/kea3/static/KEA3_logo_transparent.png',
  Human_Phenotype_Ontology: <img className="p-2 bg-gray-400" src="https://hpo.jax.org/assets/hpo-logo-white-no-words.png" alt="Human Phenotype Ontology" />,
  GWAS_Catalog_2023: 'https://www.ebi.ac.uk/gwas/images/GWAS_Catalog_circle_178x178.png',
  GWAS_Catalog_2025: 'https://www.ebi.ac.uk/gwas/images/GWAS_Catalog_circle_178x178.png',
  GO_Biological_Process_2023: 'https://geneontology.org/favicon.ico?1',
  GO_Process: 'https://geneontology.org/favicon.ico?1',
  GO_Function: 'https://geneontology.org/favicon.ico?1',
  GO_Component: 'https://geneontology.org/favicon.ico?1',
  KEGG_2021_Human: 'https://www.genome.jp/Fig/kegg128.gif',
  MGI_Mammalian_Phenotype_Level_4_2024: 'https://www.informatics.jax.org/webshare/images/mgi_logo.gif',
  OMIM_Disease: 'https://www.omim.org/static/omim/icons/OMIM_davinciman.001.png',
  HuBMAP_Azimuth: 'https://s3.amazonaws.com/maayan-kg/cfde-kg/assets/HuBMAP.png',
  HuBMAP_ASCTpB: 'https://s3.amazonaws.com/maayan-kg/cfde-kg/assets/HuBMAP.png',
}

export const source_rename: Record<string, string> = {
  HuBMAP_ASCTpB: 'HuBMAP ASCT+B',
}

export const source_pagerank: Record<string, number> = {
  LINCS_L1000_Chem_Pert_Consensus_Sigs: 0,
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: 0,
  LINCS_L1000_Consensus_Median_Signatures: 0,
  ARCHS4_IDG_Coexp: 0,
  GlyGen_Glycosylated_Proteins_2022: 0,
  GTEx_Aging_Signatures_2021: 0,
  GTEx_Tissues_V8_2023: 0,
  IDG_Drug_Targets_2022: 0,
  MoTrPAC_Endurance_Trained_Rats_2023: 1,
  KOMP2_Mouse_Phenotypes_2022: 3,
  ChEA_2022: 19,
  KEA_2015: 16,
  Human_Phenotype_Ontology: 17,
  GWAS_Catalog_2023: 17,
  GO_Biological_Process_2023: 18,
  KEGG_2021_Human: 15,
  MGI_Mammalian_Phenotype_Level_4_2024: 14,
  OMIM_Disease: 13,
  HuBMAP_Azimuth: 12,
  HuBMAP_ASCTpB: 12,
}

export const model_icons = {
  'gsfm-rummagene': 'https://rummagene.com/images/rummagene_logo.png',
  'gsfm-rummageo': 'https://rummageo.com/images/rummageo_logo.png',
  'gsfm-rummage': <div className="flex flex-row gap-2">
    <a href="https://rummagene.com" target="_blank"><img className="max-w-32" src="https://rummagene.com/images/rummagene_logo.png" alt="Rummagene" /></a>
    <a href="https://rummageno.com" target="_blank"><img className="max-w-32" src="https://rummageo.com/images/rummageo_logo.png" alt="Rummageo" /></a>
  </div>,
} as Record<string, string | React.ReactNode>

export const model_descriptions = {
  'gsfm-rummagene': <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a></>,
  'gsfm-rummageo': <>differentially expressed genes in GEO studies from <a href="https://rummageo.com" target='_blank'>RummaGEO</a></>,
  'gsfm-rummage': <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a> and differentially expressed genes in GEO studies from <a href="https://rummageo.com" target='_blank'>RummaGEO</a></>,
} as Record<string, React.ReactNode>
