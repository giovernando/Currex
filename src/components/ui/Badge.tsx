interface BadgeProps {
  type: 'calculator' | 'currency'
  size?: 'sm' | 'md'
}

const config = {
  calculator: {
    label: 'Calculator',
    className: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
    icon: '⊞',
  },
  currency: {
    label: 'Currency',
    className: 'bg-violet-500/15 text-violet-400 border border-violet-500/20',
    icon: '↔',
  },
}

export function Badge({ type, size = 'sm' }: BadgeProps) {
  const { label, className, icon } = config[type]
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full
        ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}
        ${className}
      `}
    >
      <span>{icon}</span>
      {label}
    </span>
  )
}
