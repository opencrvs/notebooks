type NameConfigFunction = (
  data: string
) => Record<string, { firstname?: string; surname?: string }>

export const NAME_CONFIG: Record<string, NameConfigFunction> = {
  'birth.child.firstNamesEng': (data: string) => ({
    'child.name': { firstname: data },
  }),
  'birth.child.familyNameEng': (data: string) => ({
    'child.name': { surname: data },
  }),
  'birth.informant.firstNamesEng': (data: string) => ({
    'informant.name': { firstname: data },
  }),
  'birth.informant.familyNameEng': (data: string) => ({
    'informant.name': { surname: data },
  }),
  'birth.mother.firstNamesEng': (data: string) => ({
    'mother.name': { firstname: data },
  }),
  'birth.mother.familyNameEng': (data: string) => ({
    'mother.name': { surname: data },
  }),
  'birth.father.firstNamesEng': (data: string) => ({
    'father.name': { firstname: data },
  }),
  'birth.father.familyNameEng': (data: string) => ({
    'father.name': { surname: data },
  }),
  'death.deceased.firstNamesEng': (data: string) => ({
    'deceased.name': { firstname: data },
  }),
  'death.deceased.familyNameEng': (data: string) => ({
    'deceased.name': { surname: data },
  }),
  'death.informant.firstNamesEng': (data: string) => ({
    'informant.name': { firstname: data },
  }),
  'death.informant.familyNameEng': (data: string) => ({
    'informant.name': { surname: data },
  }),
  'death.spouse.firstNamesEng': (data: string) => ({
    'spouse.name': { firstname: data },
  }),
  'death.spouse.familyNameEng': (data: string) => ({
    'spouse.name': { surname: data },
  }),
}
