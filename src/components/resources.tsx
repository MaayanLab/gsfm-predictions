export const source_icons: Record<string, string | React.ReactElement> = {
  LINCS_L1000_Chem_Pert_Consensus_Sigs: '/source_icons/LINCS-logo.png',
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: '/source_icons/LINCS-logo.png',
  LINCS_L1000_Consensus_Median_Signatures: '/source_icons/LINCS-logo.png',
  ARCHS4_IDG_Coexp: '/source_icons/IDG.png',
  GlyGen_Glycosylated_Proteins_2022: '/source_icons/glygen.png',
  GTEx_Aging_Signatures_2021: '/source_icons/GTEx.png',
  GTEx_Tissues_V8_2023: '/source_icons/GTEx.png',
  IDG_Drug_Targets_2022: '/source_icons/IDG.png',
  MoTrPAC_Endurance_Trained_Rats_2023: '/source_icons/MoTrPAC.png',
  KOMP2_Mouse_Phenotypes_2022: '/source_icons/KOMP2.svg',
  ChEA_2022: <img className="p-2 bg-gray-400" src="/source_icons/chea3_logo.png" alt="ChEA 2022" />,
  KEA_2015: '/source_icons/KEA3_logo_transparent.png',
  Human_Phenotype_Ontology: <img className="p-2 bg-gray-400" src="/source_icons/hpo-logo-white-no-words.png" alt="Human Phenotype Ontology" />,
  GWAS_Catalog_2023: '/source_icons/GWAS_Catalog_circle_178x178.png',
  GWAS_Catalog_2025: '/source_icons/GWAS_Catalog_circle_178x178.png',
  GO_Biological_Process_2023: '/source_icons/GO.png',
  GO_Process: '/source_icons/GO.png',
  GO_Function: '/source_icons/GO.png',
  GO_Component: '/source_icons/GO.png',
  KEGG_2021_Human: '/source_icons/kegg128.gif',
  MGI_Mammalian_Phenotype_Level_4_2024: '/source_icons/mgi_logo.gif',
  OMIM_Disease: '/source_icons/OMIM_davinciman.001.png',
  HuBMAP_Azimuth: '/source_icons/HuBMAP.png',
  HuBMAP_ASCTpB: '/source_icons/HuBMAP.png',
  'HuBMAP_ASCT+B': '/source_icons/HuBMAP.png',
}

export const source_rename: Record<string, string> = {
  HuBMAP_ASCTpB: 'HuBMAP ASCT+B',
  GO_Process: 'GO Biological Process 2025',
  GO_Function: 'GO Molecular Function 2025',
  GO_Component: 'GO Cellular Component 2025',
}

export const source_pagerank: Record<string, number> = {
  GO_Process: 100,
  GO_Function: 99,
  GO_Component: 98,
  GWAS_Catalog_2025: 90,
  KOMP2_Mouse_Phenotypes_2022: 80,
  KEGG_2021_Human: 70,
  LINCS_L1000_Chem_Pert_Consensus_Sigs: 0,
  LINCS_L1000_CRISPR_KO_Consensus_Sigs: 0,
  LINCS_L1000_Consensus_Median_Signatures: 0,
  ARCHS4_IDG_Coexp: 0,
  GlyGen_Glycosylated_Proteins_2022: 0,
  GTEx_Aging_Signatures_2021: 0,
  GTEx_Tissues_V8_2023: 0,
  IDG_Drug_Targets_2022: 0,
  MoTrPAC_Endurance_Trained_Rats_2023: 1,
  ChEA_2022: 19,
  KEA_2015: 16,
  Human_Phenotype_Ontology: 17,
  GWAS_Catalog_2023: 17,
  GO_Biological_Process_2023: 18,
  MGI_Mammalian_Phenotype_Level_4_2024: 14,
  OMIM_Disease: 13,
  HuBMAP_Azimuth: 12,
  HuBMAP_ASCTpB: 12,
}

export const model_icons = {
  'rummagene': '/model_icons/rummagene_logo.png',
  'gsfm-rummagene': '/model_icons/rummagene_logo.png',
  'gsfm-rummageo': '/model_icons/rummageo_logo.png',
  'gsfm-rummage': <div className="flex flex-row gap-2">
    <a href="https://rummagene.com" target="_blank"><img className="max-w-32" src="/model_icons/rummagene_logo.png" alt="Rummagene" /></a>
    <a href="https://rummageno.com" target="_blank"><img className="max-w-32" src="/model_icons/rummageo_logo.png" alt="Rummageo" /></a>
  </div>,
} as Record<string, string | React.ReactNode>

export const model_descriptions = {
  'rummagene': <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a></>,
  'gsfm-rummagene': <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a></>,
  'gsfm-rummageo': <>differentially expressed genes in GEO studies from <a href="https://rummageo.com" target='_blank'>RummaGEO</a></>,
  'gsfm-rummage': <>gene sets from supplemental material of literature from <a href="https://rummagene.com" target='_blank'>Rummagene</a> and differentially expressed genes in GEO studies from <a href="https://rummageo.com" target='_blank'>RummaGEO</a></>,
} as Record<string, React.ReactNode>

export const model_name = {
  'rummagene': 'Rummagene GSFM',
  'gsfm-rummagene': 'Rummagene GSFM',
  'gsfm-rummage': 'RummaGEO/Rummagene GSFM',
  'gsfm-rummageo': 'RummaGEO GSFM',
} as Record<string, string>
