// =============================================
// COMPONENTA CATEGORY VIEW MODAL (CategoryViewModal.tsx)
// Aceasta este fereastra popup care se deschide când dai click pe o categorie
// Afișează toate evenimentele dintr-o categorie (ex: nunți, botezuri)
// Fiecare eveniment are un card cu imagine de preview și detalii
// =============================================

// 'use client' = această componentă rulează în browser (nu pe server)
'use client'

// Importăm tipurile TypeScript pentru Category și Event
// Category = structura unei categorii (nume, slug, evenimente, etc.)
// Event = structura unui eveniment (nume, imagini, descriere, etc.)
import { Category, Event } from '@/types'
// Image = componenta Next.js optimizată pentru afișarea imaginilor
import Image from 'next/image'
// useState = hook React pentru a stoca starea (date care se schimbă)
import { useState } from 'react'
// EventViewModal = componenta care afișează un eveniment individual cu galerie
import EventViewModal from './EventViewModal'

// interface = definim tipurile proprietăților pe care le primește componenta
// category = categoria de afișat (sau null dacă nu e selectată)
// onClose = funcția apelată când utilizatorul închide modalul
interface CategoryViewModalProps {
  category: Category | null
  onClose: () => void
}

// Componenta principală CategoryViewModal
// Primește category și onClose ca proprietăți
export default function CategoryViewModal({ category, onClose }: CategoryViewModalProps) {
  // useState = stocăm evenimentul selectat (când utilizatorul dă click pe un eveniment)
  // null = niciun eveniment selectat inițial
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Dacă nu avem o categorie, nu afișăm nimic
  if (!category) return null

  // Funcție apelată când utilizatorul dă click pe un eveniment
  // Salvăm evenimentul selectat în stare
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  // Funcție apelată când utilizatorul închide modalul de eveniment
  // Setăm evenimentul selectat la null (închidem modalul)
  const handleCloseEventModal = () => {
    setSelectedEvent(null)
  }

  return (
    // Fragment (<> </>) = un container invizibil care grupează mai multe elemente
    // Folosit când vrem să returnăm mai multe elemente fără un div suplimentar
    <>
      {/* Stiluri CSS pentru animații - scrise direct în componentă (styled-jsx) */}
      {/* modalFadeIn = animație de apariție graduală (din invizibil în vizibil) */}
      {/* modalSlideUp = animație de glisare de jos în sus cu ușoară mărire */}
      <style jsx>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Overlay-ul (fundalul întunecat semi-transparent) */}
      {/* position: fixed = acoperă TOT ecranul, indiferent de scroll */}
      {/* zIndex: 3000 = apare deasupra conținutului normal, dar sub alte modale */}
      {/* backdropFilter: blur = face conținutul din spate neclar */}
      {/* onClick={onClose} = click pe fundal închide modalul */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3000,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          animation: 'modalFadeIn 0.3s ease'
        }}
        onClick={onClose}
      >
        {/* Cutia principală a modalului */}
        {/* top/left/right/bottom: 1rem = lasă 1rem spațiu pe fiecare parte */}
        {/* display: flex, flexDirection: column = elementele sunt aranjate vertical */}
        {/* e.stopPropagation() = oprește click-ul să ajungă la overlay (să nu închidă modalul) */}
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            bottom: '1rem',
            zIndex: 3001,
            backgroundColor: '#0a0a0a',
            borderRadius: '1rem',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'modalSlideUp 0.4s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* =============================================
              HEADER-UL MODALULUI
              Conține iconița categoriei, numele și butonul de închidere
              Temă aurie (gold) cu gradient subtil
              ============================================= */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.06) 100%)',
              borderBottom: '1px solid rgba(251,191,36,0.12)',
              color: 'white',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {/* Partea stângă: iconița și numele categoriei */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Iconița categoriei (emoji) - se afișează doar dacă există */}
              {category.icon && <span style={{ fontSize: '2rem' }}>{category.icon}</span>}
              <div>
                {/* Numele categoriei (ex: "Nuntă", "Botez") */}
                <h2 style={{
                  fontSize: '1.6rem',
                  fontWeight: 300,
                  margin: 0,
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {category.name}
                </h2>
                {/* Subtitlul categoriei (opțional) - afișat doar dacă există */}
                {category.subtitle && (
                  <p style={{
                    color: 'rgba(251,191,36,0.6)',
                    fontSize: '0.8rem',
                    margin: 0,
                    marginTop: '0.25rem',
                    letterSpacing: '0.05em'
                  }}>
                    {category.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Butonul de închidere (X) */}
            {/* flexShrink: 0 = nu se micșorează când spațiul e limitat */}
            {/* borderRadius: 50% = face butonul rotund */}
            {/* La hover: schimbă culorile în auriu */}
            <button
              onClick={onClose}
              style={{
                flexShrink: 0,
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(251,191,36,0.1)'
                e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'
                e.currentTarget.style.color = '#fbbf24'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
              }}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* =============================================
              CONȚINUTUL MODALULUI
              Afișează descrierea categoriei și lista de evenimente
              flex: 1 = ocupă tot spațiul disponibil
              overflowY: auto = bară de scroll verticală dacă conținutul e prea mare
              ============================================= */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {/* Descrierea categoriei (opțională) - text italic centrat */}
            {category.description && (
              <p style={{
                fontSize: '1.1rem',
                fontWeight: 300,
                marginBottom: '2rem',
                fontStyle: 'italic',
                padding: '1rem 2rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: '1.6',
                fontFamily: "'Playfair Display', serif"
              }}>
                {category.description}
              </p>
            )}

            {/* Verificăm dacă categoria are evenimente */}
            {category.events && category.events.length > 0 ? (
              // Dacă DA - afișăm lista de evenimente
              <>
                {/* Titlul secțiunii cu numărul de evenimente */}
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em'
                }}>
                  Evenimente ({category.events.length})
                </h3>

                {/* Containerul pentru cardurile de evenimente */}
                {/* display: flex, flexWrap: wrap = cardurile se aranjează în rânduri și trec pe rândul următor */}
                {/* justifyContent: center = centrate orizontal */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    padding: '0 0.5rem',
                    justifyContent: 'center'
                  }}
                >
                  {/* Parcurgem fiecare eveniment și creăm un card */}
                  {category.events.map((event) => (
                    <div
                      key={event.id}
                      // La click pe eveniment, deschidem modalul de eveniment
                      onClick={() => handleEventClick(event)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        width: '280px',
                        maxWidth: '100%'
                      }}
                      // Efecte la hover: chenar auriu, fundal ușor auriu, card-ul se ridică
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(251,191,36,0.2)'
                        e.currentTarget.style.background = 'rgba(251,191,36,0.03)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      {/* Imaginea de preview a evenimentului (prima imagine) */}
                      {/* Se afișează doar dacă evenimentul are imagini */}
                      {event.images && event.images.length > 0 && (
                        <div style={{
                          aspectRatio: '16/9',
                          backgroundColor: '#111',
                          overflow: 'hidden'
                        }}>
                          {/* Imaginea - folosim thumbnail dacă există, altfel imaginea originală */}
                          {/* La hover: imaginea se mărește puțin (efect de zoom) */}
                          <Image
                            src={event.images[0].thumbnailUrl || event.images[0].url}
                            alt={event.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease'
                            }}
                            width={300}
                            height={169}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      )}

                      {/* Detaliile evenimentului (sub imagine) */}
                      <div style={{ padding: '1rem' }}>
                        {/* Numele evenimentului */}
                        <h4 style={{
                          fontWeight: 400,
                          color: 'white',
                          marginBottom: '0.4rem',
                          fontSize: '1rem',
                          fontFamily: "'Playfair Display', serif"
                        }}>
                          {event.name}
                        </h4>

                        {/* Descrierea evenimentului (opțională) - limitată la 2 rânduri */}
                        {/* WebkitLineClamp: 2 = taie textul după 2 rânduri cu "..." */}
                        {event.description && (
                          <p style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.35)',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {event.description}
                          </p>
                        )}

                        {/* Rândul de jos: numărul de fotografii și link-ul "Vezi galeria" */}
                        <div style={{
                          marginTop: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.8rem'
                        }}>
                          {/* Numărul de fotografii */}
                          <span style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {event.images?.length || 0} fotografii
                          </span>
                          {/* Link-ul "Vezi galeria" în auriu */}
                          <span style={{
                            color: '#fbbf24',
                            fontWeight: 400,
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em'
                          }}>
                            Vezi galeria →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Dacă NU avem evenimente - afișăm un mesaj "În curând"
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px'
              }}>
                <div style={{
                  textAlign: 'center',
                  maxWidth: '24rem',
                  margin: '0 auto',
                  padding: '0 1.5rem'
                }}>
                  {/* Iconița decorativă de cameră */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '50%',
                    border: '1px solid rgba(251,191,36,0.15)',
                    background: 'rgba(251,191,36,0.05)',
                    marginBottom: '1.5rem'
                  }}>
                    <i className="fas fa-camera" style={{ fontSize: '2rem', color: 'rgba(251,191,36,0.4)' }}></i>
                  </div>

                  <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: 300,
                    color: 'white',
                    marginBottom: '0.75rem',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    În curând
                  </h3>

                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.3)',
                    lineHeight: '1.6'
                  }}>
                    Evenimente noi vor fi adăugate în această categorie.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =============================================
          MODALUL DE EVENIMENT (EventViewModal)
          Se afișează când utilizatorul dă click pe un eveniment
          selectedEvent = evenimentul curent selectat
          onClose = închide ambele modale (eveniment + categorie)
          onBack = închide doar modalul de eveniment (revine la lista de evenimente)
          ============================================= */}
      {selectedEvent && (
        <EventViewModal
          event={selectedEvent}
          onClose={handleCloseEventModal}
          onBack={() => setSelectedEvent(null)}
        />
      )}
    </>
  )
}
