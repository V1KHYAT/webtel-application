import React from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, Activity, Calendar as CalendarIcon, CalendarOff, 
  ArrowUpRight, ArrowDownRight, ExternalLink, Gift, Cake, 
  FileText, Search, Command, ChevronRight, User, ChevronDown
} from 'lucide-react';

const attritionData = [
  { name: 'May', rate: 2 },
  { name: 'Jun', rate: 5 },
  { name: 'Jul', rate: 12 },
  { name: 'Aug', rate: 8 },
  { name: 'Sep', rate: 9 },
  { name: 'Oct', rate: 12 },
];

const genderData = [
  { name: 'Male', value: 2265 },
  { name: 'Female', value: 73 },
];

const COLORS = ['#ffb800', '#3b82f6'];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingBottom: 'var(--space-5)', position: 'relative' }}>
      
      {/* 2. Unified Stats Card */}
      <Card style={{ padding: 'var(--space-3) 0', display: 'flex', alignItems: 'center' }}>
        
        {/* Stat 1 */}
        <div style={{ flex: 1, padding: '0 var(--space-4)', borderRight: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={32} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Employees</div>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-main)', margin: 'var(--space-0-5) 0' }}>2,338</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>All locations</div>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ flex: 1, padding: '0 var(--space-4)', borderRight: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={32} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>Present Today</div>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-main)', margin: 'var(--space-0-5) 0' }}>1,842</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#10b981', fontWeight: 600 }}>78.9% <span style={{color: 'var(--text-muted)', fontWeight: 400}}>of total</span></div>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ flex: 1, padding: '0 var(--space-4)', borderRight: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ color: '#ffb800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarIcon size={32} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>On Leave</div>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-main)', margin: 'var(--space-0-5) 0' }}>145</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#ffb800', fontWeight: 600 }}>6.2% <span style={{color: 'var(--text-muted)', fontWeight: 400}}>of total</span></div>
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{ flex: 1, padding: '0 var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarOff size={32} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>Absent</div>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-main)', margin: 'var(--space-0-5) 0' }}>351</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#ef4444', fontWeight: 600 }}>14.9% <span style={{color: 'var(--text-muted)', fontWeight: 400}}>of total</span></div>
            </div>
          </div>
        </div>

      </Card>

      {/* 3. Middle 3-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
        
        {/* Pending Requests */}
        <Card>
          <CardHeader title="Pending Requests" action={<span style={{fontSize: 'var(--text-xs)', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600}}>View all &gt;</span>} />
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {[
              { name: 'Reimbursement Request', count: 10, icon: <FileText size={16}/>, color: '#10b981', trend: '2 today', up: true },
              { name: 'Employee Master Change', count: 74, icon: <FileText size={16}/>, color: '#f59e0b', trend: '8 today', up: true },
              { name: 'Pending Travel Request', count: 74, icon: <ArrowUpRight size={16}/>, color: '#6366f1', trend: '12 today', up: true },
              { name: 'Pending Document Request', count: 34, icon: <FileText size={16}/>, color: '#3b82f6', trend: '5 today', up: true },
            ].map((req, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ color: req.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {req.icon}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-main)' }}>{req.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-main)' }}>{req.count} pending</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: req.up ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                    {req.up ? '↑' : '↓'} {req.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Access */}
        <Card>
          <CardHeader title="Quick Access" action={<span style={{fontSize: 'var(--text-xs)', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600}}>Edit</span>} />
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column' }}>
            {[
              'User Rights to view Salary slip',
              'Import Prof. Tax',
              'Template Configuration',
              'Tax Editor'
            ].map((feat, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: 'var(--space-2) 0',
                borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <ExternalLink size={16} color="var(--text-muted)" /> {feat}
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </Card>

        {/* Birthdays & Anniversaries */}
        <Card>
          <CardHeader title="Birthdays & Anniversaries" action={<span style={{fontSize: 'var(--text-xs)', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600}}>View all</span>} />
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { name: 'Ajay Kumar Yadav', type: 'Birthday', date: 'Today', icon: Cake, color: '#ffb800' },
              { name: 'Dharmendra Kumar', type: 'Work Anniversary', date: 'Tomorrow', icon: Gift, color: '#f59e0b' },
              { name: 'Vishwajeet Singh', type: 'Birthday', date: '08 Jun', icon: Cake, color: '#ffb800' },
            ].map((event, i) => {
              const Icon = event.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ color: event.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <User size={20} color="var(--text-muted)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-main)' }}>{event.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{event.type}</div>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: event.color }}>
                    {event.date}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

      </div>

      {/* 4. Bottom 3-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
        
        {/* Attrition Rate */}
        <Card style={{ display: 'flex', flexDirection: 'column', height: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Attrition Rate</h3>
            <div style={{ position: 'relative' }}>
              <select style={{ 
                appearance: 'none',
                border: '1px solid var(--border-light)', 
                borderRadius: '8px', 
                padding: '6px 32px 6px 12px', 
                fontSize: 'var(--text-xs)', 
                fontWeight: 600,
                color: 'var(--text-secondary)', 
                outline: 'none',
                background: 'var(--bg-app)',
                cursor: 'pointer'
              }}>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
            <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attritionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => `${v}%`} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="rate" stroke="var(--primary-color)" fill="rgba(255,184,0,0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: '100px', background: 'var(--bg-app)', borderRadius: '12px', padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-main)' }}>12<span style={{fontSize: 'var(--text-sm)'}}>%</span></div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Attrition Rate</div>
              <div style={{ fontSize: 'var(--text-xs)', color: '#10b981', fontWeight: 600 }}>↑ 2%</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>vs previous 6 months</div>
            </div>
          </div>
        </Card>

        {/* Gender Head Count */}
        <Card style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
          <CardHeader title="Gender Head Count" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 'var(--space-2)' }}>
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'
              }}>
                <span className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>2,338</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</span>
              </div>
            </div>
            {/* Custom Legend */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-2)', padding: 'var(--space-2)', background: 'var(--bg-app)', borderRadius: '12px' }}>
              {genderData.map((entry, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: COLORS[i % COLORS.length] }}></div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>{entry.name}</span>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-main)', marginLeft: '4px' }}>{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Latest News */}
        <Card style={{ height: '340px', display: 'flex', flexDirection: 'column' }}>
          <CardHeader title="Latest News" action={<span style={{fontSize: 'var(--text-xs)', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 600}}>View all</span>} />
          <div className="minimal-scrollbar" style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
            {[
              { title: 'Universal Health check-ups', desc: 'Employers must provide free annual health check-ups for all workers above 40.' },
              { title: 'Gig Economy Contribution', desc: 'Aggregators are required to contribute 1-2% of annual turnover.' },
              { title: 'Overtime Pay Mandate', desc: 'Overtime work must be compensated at a rate that is not less than twice.' },
              { title: 'New Leave Policy Update', desc: 'Mandatory 14-day continuous leave policy goes into effect starting next quarter.' },
              { title: 'Tax Filing Deadline Extension', desc: 'The statutory deadline for professional tax filing has been extended by 15 days.' },
              { title: 'Updated Compliance Guidelines', desc: 'Read the latest compliance guidelines issued by the Ministry of Corporate Affairs.' },
              { title: 'Annual Performance Review Kickoff', desc: 'Performance appraisal cycles begin this week. Ensure all KPIs are submitted.' },
            ].map((news, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <div style={{ color: 'var(--primary-color)', marginTop: '2px' }}>
                  <FileText size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-main)', marginBottom: 'var(--space-0-5)' }}>{news.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{news.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
