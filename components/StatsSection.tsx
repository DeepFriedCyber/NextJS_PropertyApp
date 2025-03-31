export default function StatsSection() {
  const stats = [
    {
      value: '10K+',
      label: 'Properties Listed',
      icon: '🏠'
    },
    {
      value: '2M+',
      label: 'Happy Customers',
      icon: '😊'
    },
    {
      value: '99%',
      label: 'Customer Satisfaction',
      icon: '⭐'
    },
    {
      value: '24/7',
      label: 'Customer Support',
      icon: '💬'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}