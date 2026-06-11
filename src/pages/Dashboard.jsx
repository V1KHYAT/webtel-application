import React from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { MoreHorizontal, ArrowUpRight, Gift, Cake, ExternalLink, Calendar, Search } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';

const attritionData = [
  { name: 'Apr', Joined: 400, Left: 240 },
  { name: 'May', Joined: 300, Left: 139 },
  { name: 'Jun', Joined: 200, Left: 980 },
  { name: 'Jul', Joined: 278, Left: 390 },
  { name: 'Aug', Joined: 189, Left: 480 },
  { name: 'Sep', Joined: 239, Left: 380 },
  { name: 'Oct', Joined: 349, Left: 430 },
];

const genderData = [
  { name: 'Male', value: 2265 },
  { name: 'Female', value: 73 },
];

const COLORS = ['#ffb800', '#3b82f6', '#10b981', '#ef4444'];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 1. Huge Search Bar */}
      <Card style={{ padding: '32px', background: 'linear-gradient(to right, var(--primary-color), var(--primary-hover))', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>What are you looking for?</h2>
        <SearchBar />
      </Card>

      {/* 2. Urgent Actionable Items */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <CardHeader title="Pending Requests" action={<ArrowUpRight size={16} />} />
          <div style={{ marginTop: '16px' }}>
            {[
              { name: 'Reimbursement Request', count: 10 },
              { name: 'Employee Master Change', count: 74 },
              { name: 'Pending Travel Request', count: 74 },
              { name: 'Pending Document Request', count: 34 },
            ].map((req, i) => (
              <div key={i} className="info-row" style={{ padding: '12px 0' }}>
                <div className="info-label">{req.name}</div>
                <div className="info-value" style={{ color: 'var(--primary-color)', cursor: 'pointer' }}>
                  {req.count} pending
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Most Used Features" action={<MoreHorizontal size={16} />} />
          <div style={{ marginTop: '16px' }}>
            {[
              { name: 'User Rights to view Salary slip', views: '9,039' },
              { name: 'Import Prof. Tax', views: '2,685' },
              { name: 'Template Configuration', views: '2,301' },
              { name: 'Tax Editor', views: '1,905' },
            ].map((feat, i) => (
              <div key={i} className="info-row" style={{ padding: '12px 0' }}>
                <div className="info-label">
                  <ExternalLink size={14} style={{ marginRight: '6px' }} /> {feat.name}
                </div>
                <div className="info-value">{feat.views}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Employees', val: '2,338', color: 'var(--text-main)', bg: 'var(--bg-subtle)' },
          { label: 'Present Today', val: '1,842', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'On Leave', val: '145', color: '#ffb800', bg: 'var(--primary-light)' },
          { label: 'Absent', val: '351', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
        ].map((stat, i) => (
          <Card key={i} style={{ padding: '20px', background: stat.bg, border: i === 2 ? '1px solid var(--primary-color)' : 'none' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color: stat.color }}>{stat.val}</div>
          </Card>
        ))}
      </div>

      {/* 4. Analytics & Community */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Analytics Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader title="Attrition Rate" action={<MoreHorizontal size={16} />} />
            <div style={{ height: '300px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attritionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip cursor={{ fill: 'var(--bg-hover)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Joined" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Left" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Gender Head Count" action={<MoreHorizontal size={16} />} />
            <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Community Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader title="Birthdays & Anniversaries" />
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Ajay Kumar Yadav', type: 'Birthday', date: 'Today', icon: Cake },
                { name: 'Dharmendra Kumar', type: 'Work Anniversary', date: 'Tomorrow', icon: Gift },
                { name: 'Vishwajeet Singh', type: 'Birthday', date: '08 Jun', icon: Cake },
              ].map((event, i) => {
                const Icon = event.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)', color: 'var(--primary-color)' }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{event.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{event.type}</div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary-color)' }}>
                      {event.date}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Latest News" action={<Calendar size={16} />} />
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { title: 'Universal Health check-ups', desc: 'Employers must provide free annual health check-ups for all workers above 40.' },
                { title: 'Gig Economy Contribution', desc: 'Aggregators are required to contribute 1-2% of annual turnover.' },
                { title: 'Overtime Pay Mandate', desc: 'Overtime work must be compensated at a rate that is not less than twice.' },
              ].map((news, i) => (
                <div key={i} style={{ borderLeft: '2px solid var(--primary-color)', paddingLeft: '12px', paddingBottom: '12px', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{news.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{news.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
