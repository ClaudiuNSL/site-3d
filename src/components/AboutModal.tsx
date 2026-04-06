// =============================================
// COMPONENTA ABOUT MODAL (AboutModal.tsx)
// Aceasta este fereastra popup "Despre Mine"
// Apare când utilizatorul apasă pe "Despre" în meniu
// Modal = o fereastră care se afișează deasupra conținutului principal
// =============================================

// 'use client' = spune Next.js că această componentă rulează în BROWSER (nu pe server)
// Este necesar pentru componente care au interactivitate (click-uri, hover, etc.)
'use client'

// Image = componenta Next.js optimizată pentru imagini
// Încarcă imaginile mai eficient decât un tag <img> normal
import Image from 'next/image'

// interface = definim un "contract" (tip TypeScript) pentru proprietățile componentei
// isOpen = dacă modalul este deschis (true) sau închis (false)
// onClose = funcția care se apelează când utilizatorul vrea să închidă modalul
interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

// Componenta principală AboutModal
// Primește două proprietăți: isOpen (boolean) și onClose (funcție)
// Destructurarea { isOpen, onClose } extrage valorile din obiectul props
export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  // Dacă modalul NU este deschis, nu afișa nimic (return null = nimic pe ecran)
  if (!isOpen) return null

  return (
    // Div-ul exterior = fundalul întunecat semi-transparent (overlay)
    // position: fixed = rămâne fix pe ecran, nu se mișcă la scroll
    // top/left/right/bottom: 0 = acoperă TOT ecranul
    // zIndex: 4000 = apare deasupra altor elemente (cu cât e mai mare, cu atât e mai "în față")
    // backgroundColor cu rgba = negru cu 85% opacitate (semi-transparent)
    // backdropFilter: blur = face conținutul din spate să fie neclar (efect de sticlă mată)
    // onClick={onClose} = când dai click pe fundal, se închide modalul
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 4000,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      {/* Stiluri CSS scrise direct în componentă (styled-jsx) */}
      {/* @keyframes = definesc animații CSS */}
      {/* fadeIn = animație de apariție graduală (din transparent în vizibil) */}
      {/* slideUp = animație de glisare de jos în sus */}
      {/* @media = stiluri care se aplică doar pe ecrane mici (telefoane) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .about-image-wrap {
            max-width: 250px;
            margin: 0 auto;
          }
        }
      `}</style>

      {/* Cutia principală a modalului (cardul alb/negru) */}
      {/* e.stopPropagation() = oprește click-ul să ajungă la overlay (să nu se închidă) */}
      {/* maxWidth: 800px = lățimea maximă a cutiei */}
      {/* maxHeight: 90vh = înălțimea maximă = 90% din înălțimea ecranului */}
      {/* overflow: auto = dacă conținutul e prea mare, apare bară de scroll */}
      <div
        style={{
          backgroundColor: '#0a0a0a',
          borderRadius: '20px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          animation: 'slideUp 0.4s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header-ul modalului (partea de sus cu titlu și butonul X) */}
        {/* position: sticky = rămâne lipit sus când faci scroll în modal */}
        {/* background: linear-gradient = fundal cu gradient (trecere între culori) */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.08) 100%)',
          borderBottom: '1px solid rgba(251,191,36,0.15)',
          color: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(20px)',
          zIndex: 10
        }}>
          <div>
            {/* Titlul modalului */}
            {/* fontFamily: Playfair Display = font elegant cu serife */}
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 300,
              margin: 0,
              fontFamily: "'Playfair Display', serif"
            }}>
              Despre Mine
            </h2>
            {/* Linia decorativă aurie sub titlu */}
            <div style={{
              width: '40px',
              height: '2px',
              background: 'linear-gradient(90deg, #fbbf24, transparent)',
              marginTop: '0.5rem'
            }}></div>
          </div>

          {/* Butonul de închidere (X) */}
          {/* borderRadius: 50% = face butonul rotund */}
          {/* onMouseEnter/onMouseLeave = schimbă stilul când mouse-ul trece peste buton */}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(251,191,36,0.1)'
              e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'
              e.currentTarget.style.color = '#fbbf24'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
            }}
          >
            {/* Iconița X de la Font Awesome */}
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Conținutul principal al modalului */}
        <div style={{ padding: '2rem' }}>
          {/* Grid cu 2 coloane: poza (1 parte) și textul (2 părți) */}
          {/* display: grid = layout în grilă (rânduri și coloane) */}
          {/* gridTemplateColumns: '1fr 2fr' = prima coloană ocupă 1/3, a doua 2/3 */}
          <div className="about-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Secțiunea cu fotografia fotografului */}
            {/* overflow: hidden = taie imaginea care iese din chenarul rotunjit */}
            <div className="about-image-wrap" style={{
              position: 'relative',
              borderRadius: '15px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              {/* Componenta Image din Next.js - optimizează automat imaginea */}
              {/* width/height = dimensiunile imaginii */}
              {/* priority = încarcă imaginea imediat (nu lazy) */}
              {/* filter: grayscale = face poza alb-negru (60%) */}
              {/* La hover (mouse peste) = poza devine color */}
              <Image
                src="/assets/images/despre-mine.jpg"
                alt="Banciu Costin - Fotograf"
                width={300}
                height={400}
                priority={true}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  filter: 'grayscale(60%) contrast(1.1)',
                  transition: 'filter 0.5s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'grayscale(0%) contrast(1)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(60%) contrast(1.1)'}
              />
            </div>

            {/* Secțiunea cu detaliile (text) despre fotograf */}
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>
              {/* Numele fotografului */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 300,
                marginBottom: '0.5rem',
                color: 'white',
                fontFamily: "'Playfair Display', serif"
              }}>
                Banciu Costin
              </h3>

              {/* Subtitlul - "Fotograf Profesionist" în auriu */}
              {/* textTransform: uppercase = transformă textul în LITERE MARI */}
              {/* letterSpacing = spațiu între litere */}
              <p style={{
                fontSize: '0.85rem',
                fontWeight: 400,
                color: '#fbbf24',
                marginBottom: '1.5rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}>
                Fotograf Profesionist
              </p>

              {/* Paragrafele cu descrierea fotografului */}
              {/* lineHeight: 1.8 = spațiul între rânduri (1.8x dimensiunea fontului) */}
              <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
                <p style={{ marginBottom: '1.25rem' }}>
                  Bună! Sunt Costin și sunt pasionat de fotografie de peste <strong style={{ color: '#fbbf24' }}>10 ani</strong>.
                  Specializarea mea principală este fotografia de evenimente - nunți, botezuri,
                  și momente speciale din viața oamenilor.
                </p>

                <p style={{ marginBottom: '1.25rem' }}>
                  Cred că fiecare moment are povestea lui unică și rolul meu este să surprind
                  emoțiile autentice, zâmbetele sincere și gesturile care vorbesc despre dragoste.
                </p>

                <p style={{ marginBottom: '1.25rem' }}>
                  Am avut privilegiul să documentez peste <strong style={{ color: '#fbbf24' }}>200 de nunți</strong> și
                  sute de alte evenimente speciale, fiecare cu propria sa magie și unicitate.
                </p>

                {/* Cutia de contact - cu fundal ușor auriu */}
                <div style={{
                  background: 'rgba(251,191,36,0.05)',
                  border: '1px solid rgba(251,191,36,0.1)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  marginTop: '1.5rem'
                }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    marginBottom: '0.75rem',
                    color: 'rgba(255,255,255,0.8)',
                    letterSpacing: '0.05em'
                  }}>
                    Să vorbim despre proiectul tău:
                  </h4>

                  {/* Lista de linkuri de contact */}
                  {/* display: flex, flexDirection: column = aranjate vertical (unul sub altul) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {/* Link email - href="mailto:" deschide aplicația de email */}
                    <a href="mailto:costinfoto@gmail.com" style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                      fontSize: '0.9rem', transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      <i className="fas fa-envelope" style={{ color: '#fbbf24', width: '16px' }}></i>
                      costinfoto@gmail.com
                    </a>

                    {/* Link telefon - href="tel:" deschide aplicația de apeluri */}
                    <a href="tel:+40753110407" style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                      fontSize: '0.9rem', transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      <i className="fas fa-phone" style={{ color: '#fbbf24', width: '16px' }}></i>
                      +40 753 110 407
                    </a>

                    {/* Link WhatsApp - deschide conversație WhatsApp */}
                    {/* target="_blank" = deschide în tab nou */}
                    {/* rel="noopener noreferrer" = securitate - previne accesul la pagina originală */}
                    <a
                      href="https://wa.me/40753110407"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                        fontSize: '0.9rem', transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      <i className="fab fa-whatsapp" style={{ color: '#fbbf24', width: '16px' }}></i>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
