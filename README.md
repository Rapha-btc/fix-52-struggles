# Clarinet 3.0.1 requirements resolution fails with "use of unresolved contract" despite successful caching

## Bug Description

Clarinet successfully fetches and caches mainnet contracts via `[[project.requirements]]` but fails to resolve them during `clarinet check`, resulting in "use of unresolved contract" errors.

## Environment

- **Clarinet Version**: 3.0.1
- **OS**: macOS
- **Contracts**: Mainnet contracts successfully fetched via API

## Reproduction Steps

1. Create a project with mainnet contract requirements:

```toml
[project]
name = 'bob-fix-52'
description = ''
authors = []
telemetry = false
cache_dir = './.cache'

[[project.requirements]]
contract_id = 'SP2VG7S0R4Z8PYNYCAQ04HCBX1MH75VT11VXCWQ6G.built-on-bitcoin-stxcity'

[[project.requirements]]
contract_id = 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.fakfun-faktory'

[contracts.fix-52]
path = 'contracts/fix-52.clar'
clarity_version = 3
epoch = 3.1

[repl.remote_data]
enabled = true
api_url = 'https://api.hiro.so'
```

2. Create a contract that calls these external contracts:

```clarity
(contract-call? 'SP2VG7S0R4Z8PYNYCAQ04HCBX1MH75VT11VXCWQ6G.built-on-bitcoin-stxcity send-many recipients)
(contract-call? 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.fakfun-faktory send-many recipients)
```

3. Run `clarinet check`

## Expected Behavior

Contract should compile successfully since requirements are properly configured and contracts exist on mainnet.

## Actual Behavior

```
error: use of unresolved contract 'SP2VG7S0R4Z8PYNYCAQ04HCBX1MH75VT11VXCWQ6G.built-on-bitcoin-stxcity'
--> contracts/fix-52.clar:51:6
```

## Evidence the Contracts Exist and Are Cached

1. **Contracts are successfully fetched**: Both contracts appear in `.cache/requirements/` directory
2. **API calls work**: Manual curl requests to the contracts return valid interfaces:

```bash
curl -s "https://api.hiro.so/v2/contracts/interface/SP2VG7S0R4Z8PYNYCAQ04HCBX1MH75VT11VXCWQ6G/built-on-bitcoin-stxcity"
# Returns valid contract interface
```

## Troubleshooting Attempted

- ✅ Verified `remote_data.enabled = true`
- ✅ Tried both new `[[project.requirements]]` and old `requirements = [{}]` syntax
- ✅ Cleared cache multiple times with `rm -rf .cache .clarinet`
- ✅ Tried different epoch/clarity_version combinations
- ✅ Verified contracts exist on mainnet and are accessible via API
- ❌ Requirements resolution still fails

## Additional Context

This appears to be a regression or persistent bug in Clarinet 3.0.1's requirements resolution system. The same contract configuration worked in previous versions.

**Workaround**: Ai suggests Copying cached contracts to local files and treating them as local contracts works, but defeats the purpose of the requirements system.

**Related frustration**: Tried using stxer.xyz tool to deploy a contract that was already successfully deployed (SP29D6YMDNAKN1P045T6Z817RTE1AC0JAA99WAX2B.bob-bonus-faktory) and which uses `get-tenure-info?` and got error `:0:0: use of unresolved function 'get-tenure-info?'`. Unable to diagnose what's wrong with current contract which also uses `get-tenure-info` - stuck on something that should be straightforward. Please help if you have the leisure and freedom to do so. Much appreciated.

evidence of stxer shouting at this: https://stxer.xyz/simulations/mainnet/6cfe474085cd17f6f0ba13c4c2cac103

The Bob community counts on you to help with this and reward the rightful winner of epoch fifty two.

## Sample Repository

https://github.com/Rapha-btc/fix-52-struggles

## Impact

- Blocks development workflow for contracts with mainnet dependencies
- Forces developers to use workarounds that bypass the requirements system
- Creates confusion about which Clarity functions/contracts are available

This makes basic contract development unnecessarily difficult and frustrating.
