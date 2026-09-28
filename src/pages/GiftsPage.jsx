import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { GIFTS } from '../data/gifts'
import '../../src/styles.css'
import {
  ArrowLeft,
  ChefHat,
  ExternalLink,
  Gift,
  Heart,
  House,
  Utensils,
} from 'lucide-react'

const CATEGORIES = [
  'Todos',
  'Cozinha',
  'Mesa',
  'Eletros',
  'Decoração',
]

function getCategoryIcon(category) {
  if (category === 'Todos') {
    return <Gift />
  }

  if (category === 'Cozinha') {
    return <ChefHat />
  }

  return <Utensils />
}

export default function GiftsPage() {
  const [category, setCategory] = useState('Todos')

  const visibleGifts = useMemo(() => {
    if (category === 'Todos') {
      return GIFTS
    }

    return GIFTS.filter(
      (gift) => gift.category === category,
    )
  }, [category])

  return (
    <main className="gifts-page">
      <header className="gifts-page-header">
        <Link
        to="/"
        state={{ skipIntro: true }}
        className="gifts-back-link"
        >
        <ArrowLeft size={17} />
        Voltar ao convite
        </Link>
      </header>

      <section className="gifts-page-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p>Escolha com carinho</p>

          <h1>Lista de presentes</h1>

          <div className="ornament">
            <span />
            <Heart
              size={15}
              fill="currentColor"
            />
            <span />
          </div>

          <p className="gifts-page-description">
            Preparamos esta lista com carinho para quem desejar nos presentear, mas o mais importante para nós é 
            compartilhar esse momento especial com vocês. A presença de cada um será o nosso maior presente.
          </p>
        </motion.div>
      </section>

      <section className="gifts-catalog">
        <div className="section-wrap">
          <div className="filters gifts-page-filters">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item ? 'active' : ''
                }
                onClick={() => setCategory(item)}
              >
                {getCategoryIcon(item)}
                <span>{item}</span>
              </button>
            ))}
          </div>

          <motion.div
            layout
            className="gift-grid"
          >
            {visibleGifts.map((gift) => (
              <motion.article
                layout
                key={gift.id}
                className="gift-card"
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
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="gift-image">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    loading="lazy"
                  />
                </div>

                <p className="gift-cat">
                  {gift.category}
                </p>

                <h3>{gift.name}</h3>

                <strong>{gift.price}</strong>

                <a
                  className="btn btn-outline-light full"
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} />
                  Ver na loja
                </a>
              </motion.article>
            ))}
          </motion.div>

          <div className="gifts-page-bottom">
            <Link
            to="/"
            state={{ skipIntro: true }}
            className="btn btn-gold"
            >
            <House size={16} />
            Voltar ao convite
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}