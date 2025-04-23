# mist-versions

Simple script to fetch versions of various Mist cloud environments.

To run, have NodeJS installed and run:
```
node version.js
```

Environments are listed by version, ordered from newest version to oldest.

Example output:
```
----------------------------------------
v2.19.104829-integration-c9aee88bd9
Build date: Tue Apr 22 2025
  - Integration (integration)
----------------------------------------
v2.19.104824-master-e42d6bac61
Build date: Tue Apr 22 2025
  - Staging (staging)
----------------------------------------
v2.19.104149-hotfix-v2.19.103378-93f5664c9d
Build date: Tue Apr 08 2025
  - Global02 (gc1)
  - Global03 (ac2)
  - Emea01 (eu)
  - Emea02 (gc3)
  - Emea03 (ac6)
  - Apac01 (ac5)
----------------------------------------
v2.19.103787-hotfix-v2.19.100476-7bd6976b5b
Build date: Tue Apr 01 2025
  - Global01 (production)
  - Global04 (gc2)
----------------------------------------
v2.19.99561
Build date: Tue Jan 14 2025
  - USGov01 (usgov)
```