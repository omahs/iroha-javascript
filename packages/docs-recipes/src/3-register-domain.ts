import { Client } from '@iroha2/client'
import {
  RegisterBox,
  EvaluatesToIdentifiableBox,
  Expression,
  Value,
  IdentifiableBox,
  Domain,
  DomainId,
  BTreeMapAccountIdAccount,
  Metadata,
  BTreeMapNameValue,
  BTreeMapAssetDefinitionIdAssetDefinitionEntry,
  OptionIpfsPath,
  Executable,
  VecInstruction,
  Instruction,
  QueryBox,
} from '@iroha2/data-model'

/* --snip-- */
declare const client: Client

// 1.

async function registerDomain(domainName: string) {
  const registerBox = RegisterBox({
    object: EvaluatesToIdentifiableBox({
      expression: Expression(
        'Raw',
        Value(
          'Identifiable',
          IdentifiableBox(
            'Domain',
            Domain({
              id: DomainId({
                name: domainName,
              }),
              accounts: BTreeMapAccountIdAccount(new Map()),
              metadata: Metadata({ map: BTreeMapNameValue(new Map()) }),
              asset_definitions: BTreeMapAssetDefinitionIdAssetDefinitionEntry(new Map()),
              logo: OptionIpfsPath('None'),
            }),
          ),
        ),
      ),
    }),
  })

  await client.submit(
    Executable('Instructions', VecInstruction([Instruction('Register', registerBox)])),
  )
}

// 2.

await registerDomain('test')

// 3.

async function ensureDomainExistence(domainName: string) {
  const result = await client.request(QueryBox('FindAllDomains', null))

  const domain = result
    .as('Ok')
    .as('Vec')
    .map((x) => x.as('Identifiable').as('Domain'))
    .find((x) => x.id.name === domainName)

  if (!domain) throw new Error('Not found')
}

// 4.

await ensureDomainExistence('test')
