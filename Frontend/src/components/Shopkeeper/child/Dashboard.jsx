import { IndianRupee, Package, ShoppingCart, Wallet } from 'lucide-react';
import { AgCharts } from 'ag-charts-react';
import { useState } from 'react';
import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community';
ModuleRegistry.registerModules([AllCommunityModule]);
const Dashboard = () => {
  const [loading, setLoading] = useState(false)

  const [chartOptions] = useState({
    background: {
      fill: 'transparent'
    },
    data: [
      { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
      { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
      { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
      { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
      { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
      { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    series: [
      {
        type: 'bar',
        xKey: 'month',
        yKey: 'iceCreamSales',
        fill: '#d4af50'
      },

    ]
  });



  const fetchingShopkeeperData = () => {
    setLoading(true)
    // const response = fetch('http://localhost:3000/api/')

  }
  // fetchingShopkeeperData()

  const stats = [
    {
      title: 'Monthly Revenue',
      value: '₹4,52,000',
      change: '+12.5%',
      trend: 'up',
      icon: IndianRupee,
      highlight: true,
    },
    {
      title: 'Jewelry in Stock',
      value: '248',
      change: '-5',
      trend: 'down',
      icon: Package,
    },
    {
      title: 'Jewelry Sold',
      value: '32',
      change: '+8',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Active Girvi',
      value: '18',
      change: '+3',
      trend: 'up',
      icon: Wallet,
    },
  ];



  return (
    <div className='p-3 space-y-6'>

      <div className=''>
        <h1>Welcome Back</h1>
        <p>Here's what's happening with your jewelry business today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, indx) => {
          const Icon = stat.icon

          return (
            <div>
              <div className=' space-y-3 backdrop-blur-md bg-card/40 border border-border/50 rounded-2xl transition-all duration-300 hover:translate-y-1 p-5'>
                <Icon className="h-8 w-8 bg-accent/60 p-2 rounded" />
                <h3 className="text-muted-foreground text-sm mb-1">
                  {stat.title}
                </h3>
                <p className='text-2xl'>
                  {stat.value}
                </p>
              </div>

            </div>

          )
        })}
      </div>
      <div className='space-y-5'>
        <div className='backdrop-blur-md bg-card/40 border border-border/50 rounded-2xl  p-5'>
          <AgCharts className='text-amber-600' options={chartOptions} />
        </div>
        <div className='backdrop-blur-md bg-card/40 border border-border/50 rounded-2xl  p-5'>
          <AgCharts options={chartOptions} />
        </div>

      </div>

    </div>
  )
}

export { Dashboard }
