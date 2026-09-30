import { GIFTS } from './data/gifts'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  CalendarDays,
  Check,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Clock3,
  Copy,
  Gift,
  Heart,
  MapPin,
  Menu,
  MessageCircleHeart,
  Navigation,
  Send,
  Utensils,
  X,
} from 'lucide-react'
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router'
import { supabase } from './lib/supabase'

import GiftsPage from './pages/GiftsPage'

const EVENT = {
  name: 'Giovanna e Gabriel',
  dateLabel: '05 de dezembro de 2026',
  dateShort: '05 • DEZEMBRO • 2026',
  time: '12H',
  target: '2026-12-05T12:00:00-03:00',
  venue: 'Chácara Recanto do Sol',
  address: 'R. Adiwalde de Oliveira Coelho, 411 - Parque Aeroporto de Viracopos',
  maps: 'https://www.google.com/maps/place/R.+Adiwalde+de+Oliveira+Coelho,+411+-+Parque+Aeroporto,+Campinas+-+SP,+13057-430/@-22.9822342,-47.1666281,17z/data=!3m1!4b1!4m5!3m4!1s0x94c8b642b07077f5:0x519310579bff287!8m2!3d-22.9822392!4d-47.1640532?entry=ttu&g_ep=EgoyMDI2MDgxMS4wIKXMDSoASAFQAw%3D%3D',
}

const PIX_KEY = 'gabrielbriano33@email.com'

const initialMessages = [
  { id: 1, name: 'Maria Fernandes', text: 'Que Deus abençoe esse lar que está sendo construído com tanto amor!' },
  { id: 2, name: 'Juliana & Felipe', text: 'Felizes por fazer parte deste momento tão especial!' },
  { id: 3, name: 'Camila Rocha', text: 'Contagem regressiva para aquele chá mais lindo. Amo vocês!' },
]

function InvitationPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [invitationReady, setInvitationReady] = useState(
    location.state?.skipIntro === true
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [rsvpSent, setRsvpSent] = useState(false)
  const [rsvp, setRsvp] = useState({ name: '', guests: '0', attendance: 'Sim', note: '' })
  const [messages, setMessages] = useState([])
  const [messageForm, setMessageForm] = useState({ name: '', text: '' })
  const [introFinishing, setIntroFinishing] = useState(false)

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar recados:', error)
        return
      }

      setMessages(data || [])
    }

    loadMessages()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('intro-active', !invitationReady)
    return () => document.body.classList.remove('intro-active')
  }, [invitationReady])

  useEffect(() => {
    if (location.state?.skipIntro) {
      navigate('/', {
        replace: true,
        state: null,
      })
    }
  }, [location.state, navigate])

  const finishIntro = useCallback(() => {
    if (introFinishing || invitationReady) return

    setIntroFinishing(true)

    window.setTimeout(() => {
      setInvitationReady(true)

      window.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }, 550)

    window.setTimeout(() => {
      setIntroFinishing(false)
    }, 1600)
  }, [introFinishing, invitationReady])

  const exploreInvitation = () => {
    document.querySelector('#contagem')?.scrollIntoView({ behavior: 'smooth' })
  }

  const addToCalendar = () => {
    const url = new URL('https://calendar.google.com/calendar/render')
    url.searchParams.set('action', 'TEMPLATE')
    url.searchParams.set('text', `Chá de Cozinha de ${EVENT.name}`)
    url.searchParams.set('dates', '20261205T110000Z/20261205T160000Z')
    url.searchParams.set('details', 'Uma tarde especial para celebrar esse novo capítulo!')
    url.searchParams.set('location', `${EVENT.venue} — ${EVENT.address}`)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const copyPix = async () => {
    try { await navigator.clipboard.writeText(PIX_KEY) } catch { window.prompt('Copie a chave Pix:', PIX_KEY) }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const submitRsvp = async (e) => {
    e.preventDefault()

    if (!rsvp.name.trim()) return

    const { error } = await supabase
      .from('rsvps')
      .insert({
        name: rsvp.name.trim(),
        guests: Number(rsvp.guests),
        attendance: rsvp.attendance,
        note: rsvp.note.trim() || null,
      })

    if (error) {
      console.error('Erro ao confirmar presença:', error)
      alert('Não foi possível confirmar sua presença. Tente novamente.')
      return
    }

    setRsvpSent(true)
  }

  const submitMessage = async (e) => {
    e.preventDefault()

    if (
      !messageForm.name.trim() ||
      !messageForm.text.trim()
    ) {
      return
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        name: messageForm.name.trim(),
        text: messageForm.text.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao enviar recado:', error)
      alert('Não foi possível enviar o recado.')
      return
    }

    setMessages(current => [
      data,
      ...current,
    ])

    setMessageForm({
      name: '',
      text: '',
    })
  }

  return (
    <main>
      <AnimatePresence>
        {!invitationReady && (
          <VideoIntro onFinish={finishIntro} />
        )}
      </AnimatePresence>

      {invitationReady && (
        <Header
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}

      <motion.div
        className="site-content"
        initial={false}
        animate={{
          opacity: invitationReady ? 1 : 0,
          scale: invitationReady ? 1 : 1.025,
          filter: invitationReady
            ? 'brightness(1) blur(0px)'
            : 'brightness(1.35) blur(8px)',
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          pointerEvents: invitationReady ? 'auto' : 'none',
        }}
        aria-hidden={!invitationReady}
      >
        <Hero onOpen={exploreInvitation} />

        <Countdown />

        <EventSection onCalendar={addToCalendar} />

        <RsvpSection
          rsvp={rsvp}
          setRsvp={setRsvp}
          sent={rsvpSent}
          onSubmit={submitRsvp}
        />

        <GiftPreviewSection />

        <PixSection
          copied={copied}
          onCopy={copyPix}
        />

        <MessagesSection
          messages={messages}
          form={messageForm}
          setForm={setMessageForm}
          onSubmit={submitMessage}
        />

        <Footer />
      </motion.div>

      <AnimatePresence>
        {introFinishing && (
          <motion.div
            className="intro-light-overlay"
            initial={{
              opacity: 0,
              scale: 0.05,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.05, 2.5, 8, 13],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.6,
              times: [0, 0.32, 0.68, 1],
              ease: 'easeInOut',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function VideoIntro({ onFinish }) {
  const videoRef = useRef(null)
  const onFinishRef = useRef(onFinish)
  const finishedRef = useRef(false)

  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia('(max-width: 700px)').matches
  )

  const videoSrc = isMobile
    ? '/videos/1080p2-ezremove.mp4'
    : '/videos/1920-ezremove.mp4'

  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)')

    const updateDevice = () => {
      setIsMobile(media.matches)
    }

    media.addEventListener?.('change', updateDevice)

    return () => {
      media.removeEventListener?.('change', updateDevice)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    finishedRef.current = false
    setIsLoaded(false)
    setHasError(false)

    const startVideo = async () => {
      try {
        video.currentTime = 0
        video.loop = false
        video.muted = true

        await video.play()
      } catch (error) {
        console.warn(
          'O navegador ainda não liberou a reprodução automática:',
          error,
        )
      }
    }

    startVideo()

    return () => {
      video.pause()
    }
  }, [videoSrc])

  const finishOnce = () => {
    if (finishedRef.current) return

    finishedRef.current = true

    const video = videoRef.current

    if (video) {
      video.pause()
    }

    onFinishRef.current()
  }

  const handleCanPlay = async () => {
    setIsLoaded(true)

    const video = videoRef.current

    if (!video || finishedRef.current || !video.paused) {
      return
    }

    try {
      await video.play()
    } catch (error) {
      console.warn('Não foi possível iniciar o vídeo:', error)
    }
  }

  const handleVideoEnded = () => {
    const video = videoRef.current

    if (
      video &&
      Number.isFinite(video.duration) &&
      video.currentTime < video.duration - 0.15
    ) {
      return
    }

    finishOnce()
  }

  const handleVideoError = () => {
    setHasError(true)

    console.error(
      `Não foi possível carregar o vídeo: ${videoSrc}`,
    )
  }

  return (
    <motion.section
      className="video-intro is-playing"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-label="Abertura do convite"
    >
      <video
        key={videoSrc}
        ref={videoRef}
        className="intro-film"
        src={videoSrc}
        preload="auto"
        autoPlay
        playsInline
        muted
        loop={false}
        controls={false}
        onLoadedData={() => setIsLoaded(true)}
        onCanPlay={handleCanPlay}
        onEnded={handleVideoEnded}
        onError={handleVideoError}
      />

      <div
        className="intro-film-vignette"
        aria-hidden="true"
      />

      {!isLoaded && !hasError && (
        <motion.div
          className="intro-loading"
          role="status"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Preparando seu convite...
        </motion.div>
      )}

      {hasError && (
        <div className="intro-loading" role="alert">
          Não foi possível carregar o vídeo.
        </div>
      )}

      <motion.button
        className="intro-skip"
        type="button"
        onClick={finishOnce}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Pular animação
      </motion.button>
    </motion.section>
  )
}

function Header({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')

  const links = [
    ['#inicio', 'Início'],
    ['#informacoes', 'Informações'],
    ['#presentes', 'Presentes'],
    ['#confirmacao', 'Confirmação'],
    ['#recados', 'Recados'],
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const sections = [
      'inicio',
      'informacoes',
      'presentes',
      'confirmacao',
      'recados',
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          )

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    )

    sections.forEach((id) => {
      const section = document.getElementById(id)

      if (section) {
        observer.observe(section)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <header
      className={`topbar ${scrolled ? 'scrolled' : ''}`}
    >
      <a
        href="#inicio"
        className="brand"
        onClick={() => setMenuOpen(false)}
      >
        G<span>G</span>
      </a>

      <nav className={menuOpen ? 'nav open' : 'nav'}>
        {links.map(([href, label]) => {
          const sectionId = href.replace('#', '')

          return (
            <a
              key={href}
              href={href}
              className={
                activeSection === sectionId
                  ? 'active'
                  : ''
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          )
        })}
      </nav>

      <button
        className="menu"
        aria-label="Abrir menu"
        onClick={() => setMenuOpen((value) => !value)}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </header>
  )
}

function Hero({ onOpen }) {
  return (
    <section id="inicio" className="hero hero-invitation">
      <div className="hero-invitation-content">

        <motion.p
          className="hero-invitation-title"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          CHÁ DE
          <br />
          COZINHA
        </motion.p>

        <motion.p
          className="hero-invitation-of"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.55,
          }}
        >
          DE
        </motion.p>

        <motion.div
          className="hero-invitation-names"
          initial={{
            opacity: 0,
            y: 22,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Giovanna e
          <br />
          Gabriel
        </motion.div>

        <motion.div
          className="hero-invitation-ornament"
          initial={{
            opacity: 0,
            scaleX: 0,
          }}
          animate={{
            opacity: 1,
            scaleX: 1,
          }}
          transition={{
            duration: 0.7,
            delay: 1.25,
          }}
        >
          <span />
          <i />
          <span />
        </motion.div>

        <motion.p
          className="hero-invitation-verse"
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 1.4,
          }}
        >
          Porque <span>Dele</span>, por <span>Ele</span>
          <br />
          e para <span>Ele</span> são todas as coisas.<br/>
          (Romanos 11:36)
        </motion.p>

        <motion.div
          className="hero-invitation-leaf"
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.65,
            delay: 1.75,
          }}
          aria-hidden="true"
        >
          <img
            src="/images/leaf-gold.png"
            alt=""
            draggable={false}
          />
        </motion.div>

        <motion.p
          className="hero-invitation-date"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 1.95,
          }}
        >
          05 <b>•</b> DEZEMBRO <b>•</b> 2026 <b>•</b> 12H
        </motion.p>

        <motion.button
          type="button"
          className="hero-invitation-button"
          onClick={onOpen}
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 2.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -3,
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.98,
          }}
        >
          VER DETALHES
        </motion.button>

      </div>
    </section>
  )
}

function Countdown() {
  const [left, setLeft] = useState(getRemaining())

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(getRemaining())
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="contagem"
      className="countdown-section"
    >
      <div className="countdown section-wrap">
        <p className="script-line">
          Falta pouco para esse dia especial!
        </p>

        <div className="countdown-grid">
          {Object.entries(left).map(([key, value]) => (
            <div key={key}>
              <strong>
                {String(value).padStart(2, '0')}
              </strong>

              <span>{key}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function getRemaining(){ const d=Math.max(0,new Date(EVENT.target)-Date.now()); return {dias:Math.floor(d/86400000),horas:Math.floor(d/3600000)%24,minutos:Math.floor(d/60000)%60,segundos:Math.floor(d/1000)%60} }

function Heading({ title, subtitle }) { return <div className="heading"><p>{subtitle}</p><h2>{title}</h2><div className="ornament small"><span/>●<span/></div></div> }

function EventSection({ onCalendar }) {
  return <section id="informacoes" className="section section-cream"><div className="section-wrap">
    <Heading title="Informações do evento" subtitle="Anote na agenda"/>
    <div className="info-grid">
      <Info icon={<CalendarDays/>} label="Data" title={EVENT.dateLabel} text="Sábado"/>
      <Info icon={<Clock3/>} label="Horário" title="12:00" text="A partir das 12h"/>
      <Info icon={<MapPin/>} label="Local" title={EVENT.venue} text={EVENT.address}/>
    </div>
    <div className="actions"><button className="btn btn-black" onClick={onCalendar}><CalendarDays size={17}/>Adicionar ao Google Agenda</button><a className="btn btn-outline" href={EVENT.maps} target="_blank" rel="noreferrer"><Navigation size={17}/>Ver localização</a></div>
  </div></section>
}
function Info({icon,label,title,text}) { return <motion.article className="info" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><div className="round-icon">{icon}</div><div><span>{label}</span><h3>{title}</h3><p>{text}</p></div></motion.article> }

function RsvpSection({ rsvp, setRsvp, sent, onSubmit }) {
  return <section id="confirmacao" className="section"><div className="section-wrap two-cols">
    <div className="visual-card"><img src="/images/decoracao-secundaria.png" alt="Inspiração da decoração do chá"/><div className="visual-overlay"><Gift/><span>Um momento preparado com carinho</span></div></div>
    <div className="panel">
      <Heading title="Confirmação de presença" subtitle="Esperamos por você"/>
      {sent ? <div className="success"><Check/><h3>Presença registrada!</h3><p>Obrigada por responder, {rsvp.name}.</p></div> : <form onSubmit={onSubmit} className="form">
        <label>Nome completo<input value={rsvp.name} onChange={e=>setRsvp({...rsvp,name:e.target.value})} required placeholder="Digite seu nome"/></label>
        <div className="form-row"><label>Acompanhantes<select value={rsvp.guests} onChange={e=>setRsvp({...rsvp,guests:e.target.value})}>{[0,1,2,3,4].map(n=><option key={n}>{n}</option>)}</select></label><label>Você estará presente?<select value={rsvp.attendance} onChange={e=>setRsvp({...rsvp,attendance:e.target.value})}><option>Sim</option><option>Não</option></select></label></div>
        <label>Mensagem opcional<textarea rows="3" value={rsvp.note} onChange={e=>setRsvp({...rsvp,note:e.target.value})} placeholder="Deixe uma mensagem..."/></label>
        <button className="btn btn-black full"><Heart size={16} fill="currentColor"/>Confirmar presença</button>
      </form>}
    </div>
  </div></section>
}

function GiftPreviewSection() {
  return (
    <section
      id="presentes"
      className="section section-dark"
    >
      <div className="section-wrap gifts-preview">
        <Heading
          title="Lista de presentes"
          subtitle="Escolha com carinho"
        />

        <p className="gift-preview-text">
          Preparamos uma lista especial com itens que irão
          fazer parte da construção do nosso lar.
        </p>

        <Link
          to="/presentes"
          className="btn btn-gold"
        >
          <Gift size={17} />
          Ver lista completa
        </Link>
      </div>
    </section>
  )
}

function PixSection({ copied, onCopy }) {
  return <section className="section section-cream"><div className="section-wrap pix-grid">
    <div className="pix-photo"><img src="/images/decoracao-principal.png" alt="Mesa de doces do chá"/></div>
    <div className="pix-copy"><Heading title="Presente em forma de carinho" subtitle="Opção por Pix"/><p>Se preferir, você também pode nos presentear por Pix. Qualquer valor será recebido com muito amor!</p><label>Chave Pix</label><div className="pix-key"><span>{PIX_KEY}</span><button className="btn btn-black" onClick={onCopy}>{copied?<Check/>:<Copy/>}{copied?'Copiado':'Copiar'}</button></div></div>
    <div className="qr">
      <img
        src="/images/transferir.png"
        alt="QR Code Pix"
        className="pix-qrcode"
      />

      <span>Escaneie ou copie a chave Pix</span>
    </div>
  </div></section>
}

function MessagesSection({
  messages,
  form,
  setForm,
  onSubmit,
}) {
  const [expanded, setExpanded] = useState(false)

  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia('(max-width: 600px)').matches
  )

  useEffect(() => {
    const media = window.matchMedia('(max-width: 600px)')

    const updateScreenSize = () => {
      setIsMobile(media.matches)
      setExpanded(false)
    }

    media.addEventListener?.('change', updateScreenSize)

    return () => {
      media.removeEventListener?.('change', updateScreenSize)
    }
  }, [])

  // Desktop mostra 4. Celular mostra 2.
  const initialLimit = isMobile ? 2 : 4

  const visibleMessages = expanded
    ? messages
    : messages.slice(-initialLimit)

  const hasMoreMessages = messages.length > initialLimit

  return (
    <section
      id="recados"
      className="section"
    >
      <div className="section-wrap">
        <Heading
          title="Recados dos convidados"
          subtitle="Palavras que aquecem o coração"
        />

        <div className="message-layout">
          <div className="messages-column">
            <motion.div
              layout
              className="message-grid"
            >
              <AnimatePresence initial={false}>
                {visibleMessages.map((message) => (
                  <motion.article
                    layout
                    key={message.id}
                    className="message"
                    initial={{
                      opacity: 0,
                      y: 18,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                      scale: 0.98,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <MessageCircleHeart />

                    <h3>{message.name}</h3>

                    <p>{message.text}</p>

                    <Heart
                      className="message-heart"
                      size={13}
                      fill="currentColor"
                    />
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMoreMessages && (
              <motion.button
                layout
                type="button"
                className="messages-toggle"
                onClick={() => setExpanded((current) => !current)}
                aria-expanded={expanded}
              >
                <span>
                  {expanded
                    ? 'Ocultar recados'
                    : `Ver todos os ${messages.length} recados`}
                </span>

                <motion.span
                  className="messages-toggle-icon"
                  animate={{
                    rotate: expanded ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown />
                </motion.span>
              </motion.button>
            )}
          </div>

          <form
            className="message-form"
            onSubmit={onSubmit}
          >
            <h3>Deixe seu recado</h3>

            <input
              placeholder="Seu nome"
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              required
            />

            <textarea
              rows="4"
              placeholder="Sua mensagem"
              value={form.text}
              onChange={(event) =>
                setForm({
                  ...form,
                  text: event.target.value,
                })
              }
              required
            />

            <button className="btn btn-black full">
              <Send size={16} />
              Enviar recado
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer(){ return <footer><div className="footer-monogram"><span>G</span><Heart size={14} fill="currentColor"/><span>G</span></div><p>Com amor, para sempre.</p><small>Chá de Cozinha - Giovanna e Gabriel • 2026</small></footer> }

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<InvitationPage />}
      />

      <Route
        path="/presentes"
        element={<GiftsPage />}
      />
    </Routes>
  )
}

export default App