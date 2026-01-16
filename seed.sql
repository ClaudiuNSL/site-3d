-- Creează tabelele (dacă nu există)
-- Acestea ar trebui să existe deja din migrații

-- Inserează user admin
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  'admin-user-id-123',
  'costinfoto@gmail.com',
  '$2b$12$.DBoQo7L5n1RyLtY4YyG/ehb5y16RxRUKUVaadWsgxhfWwZrGvWUS',
  'Baciu Costin',
  'ADMIN',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Inserează categoriile
INSERT INTO categories (id, name, slug, subtitle, icon, description, "order", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat-1', 'Nuntă', 'nunta', 'O zi, o viață de amintiri', '💍', 'Într-o zi, două suflete spun "da" pentru totdeauna. Nunta nu este doar un eveniment – este începutul unei povești de dragoste care va dura toată viața.', 0, true, NOW(), NOW()),
  ('cat-2', 'Botez', 'botez', 'Magia începuturilor', '👶', 'Sunt zile care trec și zile care rămân în suflet pentru totdeauna. Prima băiță în cristelniță, primele priviri pline de nevinovăție, zâmbetele celor dragi – toate aceste momente merită păstrate pentru eternitate.', 1, true, NOW(), NOW()),
  ('cat-3', 'Save the Date', 'save-date', 'Primul capitol din povestea voastră de nuntă', '📅', 'Totul începe cu o întrebare și un "da" spus din inimă. Urmează planuri, visuri, idei și acea emoție unică de a anunța lumii întregii că vă pregătiți să faceți cel mai important pas din viața voastră.', 2, true, NOW(), NOW()),
  ('cat-4', 'Cuplu', 'cuplu', 'Iubirea în fiecare cadru', '💑', 'Fiecare cuplu are povestea lui unică. Lasă-mă să surprind legătura specială dintre voi, zâmbetele complice și gesturile care vorbesc despre dragoste.', 3, true, NOW(), NOW()),
  ('cat-5', 'Familie', 'familie', 'Momente prețioase împreună', '👨‍👩‍👧‍👦', 'Familia este cel mai mare comori. Păstrează aceste momente speciale petrecute împreună într-o colecție de fotografii pline de căldură și iubire.', 4, true, NOW(), NOW()),
  ('cat-6', 'Trash the Dress', 'trash-dress', 'Aventură după nuntă', '👰', 'Rochia de mireasă a îndeplinit deja rolul ei magic. Acum este timpul pentru o sesiune foto creativă, plină de spontaneitate și libertate.', 5, true, NOW(), NOW()),
  ('cat-7', 'Absolvire', 'absolvire', 'Încheierea unui capitol, începutul altuia', '🎓', 'Absolvirea este un moment de mândrie și realizare. Surprinde această etapă importantă din viața ta cu fotografii profesionale.', 6, true, NOW(), NOW()),
  ('cat-8', 'Profesional', 'profesional', 'Imaginea ta profesională', '💼', 'Prima impresie contează. Fotografii profesionale pentru CV, LinkedIn, sau website-ul companiei tale.', 7, true, NOW(), NOW()),
  ('cat-9', 'Fotografii amuzante', 'amuzante', 'Distracție și creativitate', '🎭', 'Uneori, cele mai bune amintiri sunt cele în care râdem cu lacrimi. Sesiuni foto creative și distractive pentru orice ocazie.', 8, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
