import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import { CircleDollarSign, Users, Package } from 'lucide-react';

// Dummy data for different time periods
const timePeriodsData = {
  Today: {
    revenue: 5570,
    customers: 1200,
    products: 120,
    salesData: [
      { name: '9:00', value: 30 },
      { name: '12:00', value: 45 },
      { name: '15:00', value: 35 },
      { name: '18:00', value: 50 },
      { name: '21:00', value: 40 }
    ],
    categoryData: [
      { name: 'Men', value: 30 },
      { name: 'Women', value: 45 },
      { name: 'T-shirts', value: 15 },
      { name: 'Others', value: 10 }
    ],
    orders: [
      { id: '#23442', item: 'Art Silk Saree...', time: '12:00am', price: '$24' },
      { id: '#4546', item: 'Art Silk Saree...', time: '1:00pm', price: '$52' },
      { id: '#15152', item: 'Art Silk Saree...', time: '1:10pm', price: '$32' }
    ]
  },
  'One Week': {
    revenue: 38500,
    customers: 8500,
    products: 145,
    salesData: [
      { name: 'Mon', value: 320 },
      { name: 'Tue', value: 380 },
      { name: 'Wed', value: 420 },
      { name: 'Thu', value: 380 },
      { name: 'Fri', value: 450 },
      { name: 'Sat', value: 520 },
      { name: 'Sun', value: 480 }
    ],
    categoryData: [
      { name: 'Men', value: 35 },
      { name: 'Women', value: 40 },
      { name: 'T-shirts', value: 20 },
      { name: 'Others', value: 5 }
    ],
    orders: [
      { id: '#23442', item: 'Art Silk Saree...', time: 'Mon 12:00', price: '$124' },
      { id: '#4546', item: 'Art Silk Saree...', time: 'Tue 13:00', price: '$152' },
      { id: '#15152', item: 'Art Silk Saree...', time: 'Wed 11:10', price: '$232' }
    ]
  },
  'One Month': {
    revenue: 156000,
    customers: 35000,
    products: 180,
    salesData: [
      { name: 'Week 1', value: 3800 },
      { name: 'Week 2', value: 4200 },
      { name: 'Week 3', value: 3900 },
      { name: 'Week 4', value: 4500 }
    ],
    categoryData: [
      { name: 'Men', value: 40 },
      { name: 'Women', value: 35 },
      { name: 'T-shirts', value: 15 },
      { name: 'Others', value: 10 }
    ],
    orders: [
      { id: '#23442', item: 'Art Silk Saree...', time: 'Week 1', price: '$524' },
      { id: '#4546', item: 'Art Silk Saree...', time: 'Week 2', price: '$652' },
      { id: '#15152', item: 'Art Silk Saree...', time: 'Week 3', price: '$432' }
    ]
  },
  'One Year': {
    revenue: 1850000,
    customers: 425000,
    products: 250,
    salesData: [
      { name: 'Jan', value: 42000 },
      { name: 'Mar', value: 38000 },
      { name: 'May', value: 45000 },
      { name: 'Jul', value: 48000 },
      { name: 'Sep', value: 52000 },
      { name: 'Nov', value: 58000 }
    ],
    categoryData: [
      { name: 'Men', value: 38 },
      { name: 'Women', value: 42 },
      { name: 'T-shirts', value: 12 },
      { name: 'Others', value: 8 }
    ],
    orders: [
      { id: '#23442', item: 'Art Silk Saree...', time: 'Jan', price: '$2424' },
      { id: '#4546', item: 'Art Silk Saree...', time: 'Feb', price: '$1852' },
      { id: '#15152', item: 'Art Silk Saree...', time: 'Mar', price: '$2132' }
    ]
  }
};

const COLORS = ['#8b5cf6', '#ec4899', '#f43f5e', '#a855f7'];

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const currentData = timePeriodsData[selectedPeriod];

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Time Filter */}
      <div className="flex gap-3 mb-6">
        {Object.keys(timePeriodsData).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-6 py-2 rounded-full ${
              selectedPeriod === period 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-sm transition-colors`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Left Section (75%) */}
        <div className="col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            {/* Revenue Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-400 mb-1">Total Revenue</p>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">${currentData.revenue.toLocaleString()}</h2>
                  <p className="text-xs text-gray-400">+20% from last period</p>
                </div>
                <div className="w-16 h-16">
                  <img src="/api/placeholder/64/64" alt="revenue icon" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-400 mb-1">Total Customers</p>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">{currentData.customers.toLocaleString()}</h2>
                  <p className="text-xs text-gray-400">+15% from last period</p>
                </div>
                <div className="w-16 h-16">
                  <img src="/api/placeholder/64/64" alt="customers icon" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-gray-400 mb-1">Total Products</p>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">{currentData.products}</h2>
                  <p className="text-xs text-gray-400">+5% from last period</p>
                </div>
                <div className="w-16 h-16">
                  <img src="/api/placeholder/64/64" alt="products icon" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-5 gap-6">
            {/* Line Chart (60%) */}
            <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-400 mb-4">Sales Rate</h3>
              <div className="h-64">
                <LineChart width={500} height={200} data={currentData.salesData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </div>
            </div>

            {/* Pie Chart (40%) */}
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-400 mb-4">Sale by category</h3>
              <div className="h-64 flex justify-center">
                <PieChart width={250} height={250}>
                  <Pie
                    data={currentData.categoryData}
                    cx={120}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </div>
            </div>
          </div>
          
          {/* Bottom Section - Full Width Split */}
        <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Recent Orders - Adjusted height and padding */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-64">
          <h3 className="text-gray-400 mb-4">Recent Orders</h3>
          <div className="overflow-y-auto h-48"> {/* Fixed height scroll container */}
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-purple-600 text-white rounded-lg">
                  <th className="p-3 text-left rounded-l-lg font-medium">Customer Id</th>
                  <th className="p-3 text-left font-medium">Item Name</th>
                  <th className="p-3 text-left font-medium">Time</th>
                  <th className="p-3 text-left rounded-r-lg font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentData.orders.map((order) => (
                  <tr key={order.id} className="text-sm text-gray-600">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.item}</td>
                    <td className="p-3">{order.time}</td>
                    <td className="p-3">{order.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


            {/* Top Product */}
             <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-600 font-medium mb-4">Top Product</h3>
          <div className="flex items-start gap-6"> {/* Changed to items-start */}
            <div className="grid grid-cols-2 gap-2 w-48"> {/* Fixed width for image container */}
              <img src="/api/placeholder/96/128" alt="product view 1" className="w-full h-32 rounded object-cover" />
              <img src="/api/placeholder/96/128" alt="product view 2" className="w-full h-32 rounded object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium text-gray-800">Rani Pink Art Silk Saree</h4>
              <p className="text-4xl font-bold text-purple-600 my-2">16</p>
              <p className="text-sm text-gray-500">units sold</p>
              <p className="text-sm text-purple-600 font-medium">$200 revenue earned</p>
            </div>
          </div>
        </div>
      

          </div>
        </div>

        {/* Right Section (25%) */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm ">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-gray-600 font-medium">Low Stock Alert!</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Saree</span>
                <button className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {[2, 4, 1, 6, 8].map((stock, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img src="/api/placeholder/48/48" alt="product" className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Rani Pink Art Silk Saree</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full" 
                        style={{ width: `${(stock/200)*100}%` }}
                      />
                    </div>
                  </div>
                  <button className="text-purple-600 text-sm">Add +</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;