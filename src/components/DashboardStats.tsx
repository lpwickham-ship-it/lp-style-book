type Stat = { label: string; value: string | number }

export default function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-espresso/10">
      {stats.map(stat => (
        <div key={stat.label} className="bg-cream px-6 py-6">
          <p className="font-serif text-3xl text-espresso mb-1">{stat.value}</p>
          <p className="text-xs tracking-widest uppercase text-warm">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
