import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Send,
  Square,
  Building2,
  Package,
  Image as ImageIcon,
  FileText,
  Search,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  Wrench,
  ExternalLink,
  ChevronRight,
  Info,
  LogIn,
  LogOut,
  UserCircle2
} from 'lucide-react'
import { Streamdown } from 'streamdown'

import { useAIChat } from '@/lib/ai-hook'
import type { ChatMessages } from '@/lib/ai-hook'
import { useIdentity } from '@/lib/identity-context'

// Complete Sador Group PLCs data digitized from the whiteboard
const COMPANIES = [
  {
    id: 1,
    name: 'Sador Business Plc',
    desc: 'General trading, business operations, retail networks, and commercial enterprise.',
    type: 'Trading & Commercial Operations',
    color: 'border-orange-500'
  },
  {
    id: 2,
    name: "Dhakabora Eng'g",
    desc: 'Engineering consultancy, structural design, project feasibility, and technical drafting.',
    type: 'Structural & Architectural Engineering',
    color: 'border-blue-500'
  },
  {
    id: 3,
    name: 'Tumata Eng Plc',
    desc: 'Specialist civil engineering, infrastructure execution, heavy construction, and public works.',
    type: 'Civil Works & Heavy Infrastructure',
    color: 'border-green-500'
  },
  {
    id: 4,
    name: 'Rodas Industry Plc',
    desc: 'Large-scale industrial manufacturing, steel fabrication, metal plate extrusion, and raw material processing.',
    type: 'Industrial Metal Fabrication & Processing',
    color: 'border-purple-500'
  },
  {
    id: 5,
    name: "Nano Eng'g Plc",
    desc: 'Precision systems engineering, micro-technologies, high-tech manufacturing, and advanced electronic design.',
    type: 'Precision Tech & Advanced Electronics',
    color: 'border-cyan-500'
  },
  {
    id: 6,
    name: 'Praxis Int. Business Plc',
    desc: 'International trade, import/export facilitation, customs clearance, and global supply chain logistics.',
    type: 'Global Logistics & Import/Export',
    color: 'border-amber-500'
  },
  {
    id: 7,
    name: 'Kinual Business Plc',
    desc: 'Local commerce networks, B2B distribution, retail outlet operations, and regional wholesale markets.',
    type: 'Domestic Commerce & Wholesale Distribution',
    color: 'border-rose-500'
  }
]

// Corporate Departments
const DEPARTMENTS = [
  { id: 'a', name: 'Market Strategy & Sales Outlets', detail: 'Directs marketing initiatives, customer relations, and retail store management.' },
  { id: 'b', name: 'Supply Chain & Logistics', detail: 'Handles international/domestic procurement, shipping, warehousing, and transportation.' },
  { id: 'c', name: 'Design & Business Development', detail: 'Manages architectural design, custom product drafting, and new business partnerships.' },
  { id: 'd', name: 'System Dev & Strategic Planning', detail: 'Drives information technology, systems engineering, digital infrastructure, and long-term group scaling.' },
  { id: 'e', name: 'Construction & Project Office', detail: 'Oversees on-site installation, structural engineering execution, site supervision, and project management.' }
]

// Complete Sador Group Catalog digitized from the whiteboards
const CATALOG = [
  {
    manager: 'LMN',
    division: 'Stainless & PC Steel',
    seriesCount: 2,
    items: ['Roller Shutter', 'Canopy / Pergola', 'PC Sheet'],
    color: 'border-l-rose-500',
    tags: ['Steel', 'Stainless', 'PC Sheets', 'Outdoor']
  },
  {
    manager: 'Opa',
    division: 'Steel Products',
    seriesCount: 8,
    items: ['Carbon Steel Pipes & Plates', 'Roofing Sheets', 'Expanded Mesh'],
    color: 'border-l-sky-500',
    tags: ['Steel', 'Pipes', 'Plates', 'Industrial']
  },
  {
    manager: 'RST',
    division: 'Fabricated Facades',
    seriesCount: 5,
    items: ['Column Cladding', 'Ceiling Cladding', 'Perforated Facade / Sun Breaker'],
    color: 'border-l-amber-500',
    tags: ['Facade', 'Cladding', 'Architectural', 'Ceiling']
  },
  {
    manager: 'Tinsae',
    division: 'Handrail Series',
    seriesCount: 4,
    items: [
      'Aluminum Profiles & Accessories',
      'Stainless Steel Pipes & Accessories',
      'Glass Handrails & Accessories',
      'Manufactured Steel Handrails & Accessories'
    ],
    color: 'border-l-emerald-500',
    tags: ['Handrails', 'Aluminum', 'Glass', 'Stainless']
  },
  {
    manager: 'Kabron',
    division: 'Glass & Glass Accessories',
    seriesCount: 6,
    items: [
      'Direct Glass Sales',
      'Frameless Glass Door Accessories',
      'Showerbox Systems',
      'Glass Tempering Service'
    ],
    color: 'border-l-indigo-500',
    tags: ['Glass', 'Tempering', 'Doors', 'Showerbox']
  },
  {
    manager: 'Hawniat',
    division: 'Unique Aluminum Series & Accessories',
    seriesCount: 5,
    items: [
      'Tile Trim Series',
      'LED Series',
      'Adv/Photo Frame Series',
      'Ceiling Series',
      'Multi-color Series',
      'Curtain Rail Series',
      'Cable Tray Series'
    ],
    color: 'border-l-teal-500',
    tags: ['Aluminum', 'Trim', 'LED', 'Frames', 'Cable Tray']
  },
  {
    manager: 'XYZ',
    division: 'ACP & Furniture with Accessories',
    seriesCount: 4,
    items: ['ACP (Aluminum Composite Panel)', 'Furniture Sections', 'Readymade Products', 'Display & Exhibition Series'],
    color: 'border-l-violet-500',
    tags: ['ACP', 'Furniture', 'Exhibition', 'Panels']
  },
  {
    manager: 'Lessan',
    division: "Market's Common WD & CW Series",
    seriesCount: 5,
    items: [
      'All Co.5 & GULF series with Accessories',
      'Folding Series with Accessories',
      'Partition Series',
      'Sliding & Hanging Series with Accessories'
    ],
    color: 'border-l-orange-500',
    tags: ['Windows', 'Doors', 'Folding', 'Sliding', 'Partitions']
  },
  {
    manager: 'ABC',
    division: "Sador's Unique WD Series",
    seriesCount: 2,
    items: [
      'Sador Socket Series',
      'Window Seal, Copping & Decor',
      'PT Door / Vertical Folding / Vertical Sliding',
      'Slim Door / Glass Folding Door'
    ],
    color: 'border-l-pink-500',
    tags: ['Unique', 'Doors', 'Windows', 'Copping', 'Slim Door']
  },
  {
    manager: 'Merhawi',
    division: 'Machineries & Tools',
    seriesCount: 3,
    items: [
      'Aluminum Workshop Machinery',
      'Stainless Steel Workshop Machinery',
      'Steel Workshop Machinery'
    ],
    color: 'border-l-cyan-500',
    tags: ['Machinery', 'Workshop', 'Tools', 'Aluminum', 'Steel']
  }
]

// Whiteboards representation
const WHITEBOARDS = [
  {
    id: 1,
    title: 'Product Managers & Corporate Structure',
    image: '/assets/20260528_153638.jpg',
    description: 'Whiteboard capturing the corporate structure with 5 core departments and 10 Product Managers with their specialized product lines.'
  },
  {
    id: 2,
    title: 'Material Lines Details (Alternative Angle)',
    image: '/assets/20260528_153648.jpg',
    description: 'Alternative perspective of the primary whiteboard documenting Product Managers RST, Tinsae, Kabron, Hawniat, XYZ, Lessan, ABC, and Merhawi.'
  },
  {
    id: 3,
    title: 'Sador Group PLCs Structure',
    image: '/assets/20260528_153658.jpg',
    description: 'Whiteboard layout detailing "Sador Group" with 1,030 staff members and its 7 Public Limited Companies (PLCs).'
  }
]

// Suggested starter prompts
const SUGGESTED_PROMPTS = [
  { text: "Who manages the Unique Aluminum Series?", label: "Manager Lookup" },
  { text: "What are the 7 PLCs in Sador Group?", label: "Group Structure" },
  { text: "Explain the corporate departments", label: "Departments" },
  { text: "Tell me about Sador's glass services", label: "Glass & Tempering" }
]

function Messages({ messages }: { messages: ChatMessages }) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
        <Sparkles className="w-10 h-10 text-orange-500 mb-3 animate-pulse" />
        <h3 className="text-lg font-semibold text-neutral-200">Sador Copilot Idle</h3>
        <p className="text-sm max-w-sm mt-1">
          Ask any question about Sador Group, its 7 PLCs, or 10 material catalogs. Or click any item on the left to start!
        </p>
      </div>
    )
  }

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto pb-4 min-h-0 divide-y divide-neutral-900"
    >
      {messages.map((message) => (
        <div key={message.id} className="p-4 bg-neutral-950/20">
          <div className="flex items-start gap-3 max-w-3xl mx-auto w-full">
            <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
              message.role === 'assistant' 
                ? 'border-orange-500/50 bg-orange-950/30 text-orange-500' 
                : 'border-neutral-700 bg-neutral-800 text-neutral-300'
            }`}>
              {message.role === 'assistant' ? 'AI' : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mb-1">
                {message.role === 'assistant' ? 'Sador Copilot' : 'User Query'}
              </span>
              {message.parts.map((part, index) => {
                if (part.type === 'text' && part.content) {
                  return (
                    <div
                      className="flex-1 min-w-0 prose prose-invert max-w-none text-sm leading-relaxed text-neutral-300"
                      key={index}
                    >
                      <Streamdown>{part.content}</Streamdown>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AuthControl() {
  const { user, ready, logout } = useIdentity()
  const navigate = useNavigate()

  if (!ready) {
    return <div className="w-20 h-8 rounded-lg bg-neutral-900/40 animate-pulse" />
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-600/10 hover:bg-orange-600/20 border border-orange-500/30 rounded-lg px-3 py-2 transition-colors"
      >
        <LogIn className="w-3.5 h-3.5" />
        Sign in
      </Link>
    )
  }

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-300 bg-neutral-900/50 border border-neutral-800 rounded-lg px-2.5 py-2">
        <UserCircle2 className="w-3.5 h-3.5 text-orange-500" />
        <span className="font-medium truncate max-w-[140px]">
          {user.name || user.email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        title="Sign out"
        className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-orange-400 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 transition-colors"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </div>
  )
}

function Home() {
  const [activeTab, setActiveTab] = useState<'companies' | 'catalog' | 'whiteboards' | 'quote'>('companies')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<typeof WHITEBOARDS[0] | null>(null)
  
  // Quote form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    product_interest: '',
    message: '',
    bot_field: ''
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, stop } = useAIChat()

  const handlePromptClick = (text: string) => {
    setInput(text)
    sendMessage(text)
    setInput('')
  }

  const handleAskAboutProduct = (manager: string, division: string, product: string) => {
    const prompt = `Tell me about the product "${product}" managed by ${manager} under the "${division}" division of Sador Group.`
    handlePromptClick(prompt)
  }

  const handleInquireProduct = (product: string) => {
    setFormData((prev) => ({ ...prev, product_interest: product }))
    setActiveTab('quote')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      setFormError('Name and Email are required fields.')
      return
    }

    setFormSubmitting(true)
    setFormError(null)

    try {
      // Build form-urlencoded payload
      const payload = new URLSearchParams()
      payload.append('form-name', 'quote_request')
      payload.append('name', formData.name)
      payload.append('email', formData.email)
      payload.append('company', formData.company)
      payload.append('product_interest', formData.product_interest)
      payload.append('message', formData.message)
      if (formData.bot_field) {
        payload.append('bot-field', formData.bot_field)
      }

      const response = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      })

      if (response.ok) {
        setFormSubmitted(true)
        setFormData({
          name: '',
          email: '',
          company: '',
          product_interest: '',
          message: '',
          bot_field: ''
        })
      } else {
        throw new Error('Netlify form submission failed. Server responded with status: ' + response.status)
      }
    } catch (err: any) {
      console.error(err)
      setFormError('Submission failed. Please try again.')
    } finally {
      setFormSubmitting(false)
    }
  }

  // Filter catalog based on search
  const filteredCatalog = CATALOG.filter((cat) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      cat.division.toLowerCase().includes(searchLower) ||
      cat.manager.toLowerCase().includes(searchLower) ||
      cat.items.some((item) => item.toLowerCase().includes(searchLower)) ||
      cat.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  })

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500/30 selection:text-orange-400">
      
      {/* LEFT PANEL - Sador Group Digitized Hub */}
      <div className="flex-1 lg:max-w-[55%] flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-900 bg-neutral-950 overflow-hidden">
        
        {/* Hub Header */}
        <div className="p-5 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/15 rounded-lg border border-orange-500/20">
                <Building2 className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-100 font-mono">
                  SADOR GROUP <span className="text-[11px] text-orange-500 font-semibold border border-orange-500/30 px-1.5 py-[1px] rounded ml-1 bg-orange-500/5">HUB</span>
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Corporate Asset Digitizer & Material Catalog Explorer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end text-[10px] text-neutral-500 font-mono">
                <div>STRENGTH: 1,030 STAFF</div>
                <div>STRUCTURE: 7 PLCs | 10 PMs</div>
              </div>
              <AuthControl />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-900 bg-neutral-900/10 px-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all ${
              activeTab === 'companies'
                ? 'border-orange-500 text-orange-500 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            PLCs Directory
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-orange-500 text-orange-500 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Material Catalog
          </button>
          <button
            onClick={() => setActiveTab('whiteboards')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all ${
              activeTab === 'whiteboards'
                ? 'border-orange-500 text-orange-500 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Whiteboards
          </button>
          <button
            onClick={() => setActiveTab('quote')}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all relative ${
              activeTab === 'quote'
                ? 'border-orange-500 text-orange-500 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Quote Inquiry
            {formData.product_interest && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
            )}
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-neutral-950/20">
          
          {/* Tab 1: Companies (7 PLCs) */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Info className="w-4 h-4" /> Sador Group Conglomerate
                </h2>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Sador Group integrates 7 core PLCs spanning engineering, design, manufacturing, commerce, and international supply chain logictics. Together with 1,030 staff members, we operate under a highly synchronized corporate structure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMPANIES.map((company) => (
                  <div
                    key={company.id}
                    className={`bg-neutral-900/20 hover:bg-neutral-900/40 border border-neutral-900 rounded-lg p-4 transition-all duration-200 group flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-neutral-500 tracking-wider">
                          PLC 0{company.id}
                        </span>
                        <span className="text-[10px] font-mono text-orange-400/80 bg-orange-950/20 px-2 py-0.5 rounded border border-orange-950/30">
                          {company.type}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-neutral-200 mt-2 font-mono group-hover:text-orange-400 transition-colors">
                        {company.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                        {company.desc}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-900/60">
                      <button
                        onClick={() => handlePromptClick(`Tell me more about ${company.name} and its functions.`)}
                        className="flex-1 text-[11px] font-mono text-neutral-400 hover:text-orange-400 bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800 rounded py-1.5 transition-all text-center flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" /> Ask Copilot
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Department Section */}
              <div className="mt-8 border-t border-neutral-900 pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-neutral-400 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500/80" /> Corporate Department Structure
                </h3>
                <div className="space-y-3">
                  {DEPARTMENTS.map((dept) => (
                    <div key={dept.id} className="bg-neutral-900/10 border border-neutral-900/40 p-3.5 rounded-lg flex items-start gap-3">
                      <div className="w-6 h-6 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-orange-500/80 flex-shrink-0">
                        {dept.id}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-200 font-mono">{dept.name}</h4>
                        <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{dept.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Material Catalog (10 Product Managers) */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800/80 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search materials, products, managers, or tags..."
                  className="bg-transparent border-0 text-sm focus:outline-none w-full text-neutral-200 placeholder-neutral-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-mono text-neutral-500 hover:text-neutral-300"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {filteredCatalog.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`bg-neutral-900/20 border border-neutral-900 border-l-4 ${cat.color} rounded-r-lg p-4 hover:bg-neutral-900/30 transition-all duration-200`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                          Product Manager: <strong className="text-orange-500">{cat.manager}</strong>
                        </span>
                        <h3 className="text-base font-bold text-neutral-200 mt-1 font-mono">
                          {cat.division}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 self-start sm:self-center">
                        <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                          Series: {cat.seriesCount}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                        Material & Product Items:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {cat.items.map((item, i) => (
                          <div
                            key={i}
                            className="bg-neutral-950/40 border border-neutral-900/80 p-2.5 rounded flex items-center justify-between group hover:border-neutral-800 transition-colors"
                          >
                            <span className="text-xs text-neutral-300 font-sans font-medium">{item}</span>
                            <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleAskAboutProduct(cat.manager, cat.division, item)}
                                title="Ask AI about this"
                                className="p-1 hover:text-orange-400 hover:bg-neutral-900 rounded"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleInquireProduct(item)}
                                title="Inquire Quote"
                                className="p-1 hover:text-orange-400 hover:bg-neutral-900 rounded"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {cat.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono text-neutral-500 bg-neutral-950/20 px-1.5 py-0.5 rounded border border-neutral-900"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredCatalog.length === 0 && (
                  <div className="text-center py-12 border border-neutral-900 border-dashed rounded-lg">
                    <p className="text-xs text-neutral-500">
                      No material category or product matches "{searchQuery}".
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Whiteboards session */}
          {activeTab === 'whiteboards' && (
            <div className="space-y-6">
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wider font-mono flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Physical Source Digitization
                </h2>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  These represent the physical whiteboard sessions that were captured and digitized by the AI agent. The AI Copilot is fully synchronized against these hand-written sketches, transforming them into a structured database.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {WHITEBOARDS.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => setSelectedWhiteboard(board)}
                    className="bg-neutral-900/10 border border-neutral-900 hover:border-orange-500/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group"
                  >
                    <div className="relative aspect-square bg-neutral-950 overflow-hidden flex items-center justify-center border-b border-neutral-900">
                      <img
                        src={board.image}
                        alt={board.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <span className="text-xs font-mono text-orange-400 bg-neutral-950 px-2 py-1 rounded border border-orange-500/20">
                          Click to Enlarge
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-neutral-200 font-mono line-clamp-1">{board.title}</h4>
                      <p className="text-[10px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">{board.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Request Quote (Netlify Forms) */}
          {activeTab === 'quote' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-lg p-4">
                <h2 className="text-sm font-semibold text-orange-500 uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Material Quote Request
                </h2>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Submit an official inquiry. Your request will automatically map directly to the corresponding Product Manager (LMN, Opa, RST, Tinsae, Kabron, Hawniat, XYZ, Lessan, ABC, or Merhawi) via Netlify's serverless forms handler.
                </p>
              </div>

              {formSubmitted ? (
                <div className="border border-green-500/20 bg-green-950/10 rounded-lg p-6 text-center space-y-4">
                  <CheckCircle className="w-10 h-10 text-green-500 mx-auto animate-bounce" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-200 font-mono">Inquiry Successfully Routed</h3>
                    <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto leading-relaxed">
                      Thank you! Your quote request has been registered in the Netlify Forms database and dispatched to Sador Group's management team.
                    </p>
                  </div>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-mono text-orange-500 hover:text-orange-400 hover:underline pt-2"
                  >
                    Submit another quote request
                  </button>
                </div>
              ) : (
                <form
                  name="quote_request"
                  method="POST"
                  onSubmit={handleFormSubmit}
                  className="space-y-4"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                >
                  {/* Hidden field for Netlify Forms AJAX */}
                  <input type="hidden" name="form-name" value="quote_request" />
                  
                  {/* Honeypot field */}
                  <p className="hidden">
                    <label>
                      Don't fill this: <input name="bot-field" value={formData.bot_field} onChange={(e) => setFormData({...formData, bot_field: e.target.value})} />
                    </label>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Samuel Alemu"
                        className="w-full bg-neutral-900 border border-neutral-850 rounded px-3 py-2 text-xs focus:border-orange-500/50 focus:outline-none placeholder-neutral-600 text-neutral-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="e.g. samuel@example.com"
                        className="w-full bg-neutral-900 border border-neutral-850 rounded px-3 py-2 text-xs focus:border-orange-500/50 focus:outline-none placeholder-neutral-600 text-neutral-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        placeholder="e.g. National Construction Corp"
                        className="w-full bg-neutral-900 border border-neutral-850 rounded px-3 py-2 text-xs focus:border-orange-500/50 focus:outline-none placeholder-neutral-600 text-neutral-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                        Material/Product Interest
                      </label>
                      <input
                        type="text"
                        name="product_interest"
                        value={formData.product_interest}
                        onChange={(e) => setFormData({...formData, product_interest: e.target.value})}
                        placeholder="e.g. Frameless Glass Door Accessories"
                        className="w-full bg-neutral-900 border border-neutral-850 rounded px-3 py-2 text-xs focus:border-orange-500/50 focus:outline-none placeholder-neutral-600 text-neutral-200 text-orange-400 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                      Detailed Message / Specifications
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Specify size, volume, finishes, or custom engineering requirements..."
                      className="w-full bg-neutral-900 border border-neutral-850 rounded px-3 py-2 text-xs focus:border-orange-500/50 focus:outline-none placeholder-neutral-600 text-neutral-200 resize-none"
                    ></textarea>
                  </div>

                  {formError && (
                    <div className="text-xs text-rose-500 bg-rose-950/15 border border-rose-950/30 px-3 py-2 rounded">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-neutral-100 font-mono text-xs font-bold py-2.5 px-4 rounded transition-all duration-150 flex items-center justify-center gap-1"
                  >
                    {formSubmitting ? 'Routing Submission...' : 'Submit Official Quote Inquiry'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Left Panel Footer */}
        <div className="p-3 border-t border-neutral-900 text-center text-[10px] font-mono text-neutral-500">
          Sador Business Group © 2026. All operations digitized from whiteboard sessions.
        </div>

      </div>

      {/* RIGHT PANEL - AI Copilot Workspace */}
      <div className="flex-1 lg:max-w-[45%] flex flex-col bg-neutral-950 overflow-hidden">
        
        {/* Copilot Header */}
        <div className="p-5 border-b border-neutral-900 bg-neutral-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <div>
              <h2 className="text-sm font-bold font-mono tracking-wide text-neutral-100">
                SADOR AI COPILOT
              </h2>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE | MODEL: MULTI-PROVIDER FALLBACK
              </div>
            </div>
          </div>
          {isLoading && (
            <button
              onClick={stop}
              className="px-2.5 py-1 border border-neutral-850 hover:border-rose-500/30 text-rose-400 hover:bg-rose-950/15 rounded text-[10px] font-mono flex items-center gap-1 transition-all"
            >
              <Square className="w-2.5 h-2.5 fill-current" />
              STOP
            </button>
          )}
        </div>

        {/* Message Panel */}
        <Messages messages={messages} />

        {/* Suggestion Prompts */}
        {messages.length === 0 && (
          <div className="px-5 py-3 border-t border-neutral-900 bg-neutral-950/30">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">
              Suggested Explorations:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="bg-neutral-900/30 hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 text-left p-2.5 rounded transition-all duration-150 group text-xs flex flex-col justify-between h-14"
                >
                  <span className="text-[9px] font-mono text-orange-500/80 group-hover:text-orange-400">
                    [{prompt.label}]
                  </span>
                  <span className="text-neutral-300 font-sans line-clamp-1 group-hover:text-neutral-100 text-[11px] mt-0.5">
                    {prompt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-4 border-t border-neutral-900 bg-neutral-950">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim() && !isLoading) {
                sendMessage(input)
                setInput('')
              }
            }}
            className="flex items-center gap-2 max-w-2xl mx-auto w-full"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sador Copilot anything..."
              className="flex-1 bg-neutral-900 border border-neutral-850 rounded-lg px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-orange-500/50 font-sans"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-orange-500 hover:border-orange-500/30 disabled:opacity-30 rounded-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* WHITEBOARD LIGHTBOX MODAL */}
      {selectedWhiteboard && (
        <div
          className="fixed inset-0 bg-neutral-950/90 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedWhiteboard(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-850 rounded-xl p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-850">
              <h3 className="text-sm font-bold font-mono text-orange-500 uppercase tracking-wider">
                {selectedWhiteboard.title}
              </h3>
              <button
                onClick={() => setSelectedWhiteboard(null)}
                className="text-xs font-mono text-neutral-400 hover:text-neutral-200 border border-neutral-800 px-2 py-0.5 rounded"
              >
                Close ESC
              </button>
            </div>
            <div className="bg-neutral-950 rounded-lg p-2 flex items-center justify-center overflow-hidden aspect-video">
              <img
                src={selectedWhiteboard.image}
                alt={selectedWhiteboard.title}
                className="object-contain max-h-[60vh] rounded"
              />
            </div>
            <p className="text-xs text-neutral-300 mt-4 leading-relaxed font-sans">
              {selectedWhiteboard.description}
            </p>
          </div>
        </div>
      )}

    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})
