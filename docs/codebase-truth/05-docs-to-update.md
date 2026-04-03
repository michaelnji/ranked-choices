# Docs To Update In Repository

## Immediate Updates
1. README
   - Change Nuxt 3 to Nuxt 4
   - Reflect PWA status
   - Reflect weighted/manual naming
   - Reflect local profile personalization if it is intentionally kept

2. Architecture docs
   - Replace separate score-store assumptions
   - Document embedded `Item.scores`
   - Document current Dexie schema including `profile`

3. Product docs
   - Replace computed/manual wording with weighted/manual
   - Replace strict manual-until-reset wording if the code will remain unchanged
   - Describe actual scoring UX currently present in the app

## Suggested Documentation Principle
All future docs should use one of these labels:

- Verified in code
- Assumed but not yet verified
- Deprecated planning assumption

That will prevent old planning documents from silently overruling the implementation.
