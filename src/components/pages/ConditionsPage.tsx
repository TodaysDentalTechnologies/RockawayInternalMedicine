import Conditions, { CONDITIONS_PAGE_INTRO } from '../Conditions'

export default function ConditionsPage() {
  return (
    <div style={{ paddingTop: 'clamp(28px,5vh,48px)', background: 'var(--bg)' }}>
      <Conditions intro={CONDITIONS_PAGE_INTRO} />
    </div>
  )
}
