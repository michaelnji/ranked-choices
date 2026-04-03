# Release Gating Checklist

Use this before declaring the current MVP ready.

## Product Truth Checks
- [ ] Docs say Nuxt 4, not Nuxt 3
- [ ] Docs use weighted/manual terminology consistently
- [ ] Docs state scores are embedded in items
- [ ] Docs define profile as optional local personalization only

## Functional Checks
- [ ] Create list works
- [ ] Rename list works
- [ ] Delete list works
- [ ] Add criteria works
- [ ] Criteria weight clamping works
- [ ] Add item works
- [ ] Item score persistence works
- [ ] Weighted ranking is deterministic
- [ ] Manual drag reorder persists
- [ ] Ranking mode switch persists
- [ ] Data survives refresh and reopen

## Constraint Checks
- [ ] 20-criteria limit enforced
- [ ] 100-item limit enforced
- [ ] weight clamping to 0-10 enforced
- [ ] score clamping to 0-10 enforced

## PWA Checks
- [ ] App installs cleanly
- [ ] App opens offline
- [ ] Cached shell behaves correctly after reload
- [ ] No critical failure when offline

## Audit Checks
- [ ] No hidden backend dependency
- [ ] No auth dependency
- [ ] No server ownership assumption
- [ ] No UI flows depend on cloud data

## Remaining Verification Items
- [ ] Confirm whether item editing supports granular numeric per-criterion scores beyond binary add-flow toggles
- [ ] Confirm whether profile has a creation/edit flow or is only read on the homepage
- [ ] Confirm whether delete and rename flows update related timestamps consistently
