// ============================================
// FIȘIER: utils.ts - Funcții Utilitare (Helper Functions)
// ============================================
// Acest fișier conține funcții ajutătoare pe care le folosim
// în mai multe locuri din aplicație. Sunt funcții mici și reutilizabile
// care fac diverse transformări pe date.
// ============================================

// Importăm "clsx" - o bibliotecă mică care combină clase CSS.
// "ClassValue" este tipul TypeScript care definește ce valori acceptă clsx
// (stringuri, array-uri, obiecte, etc.)
import { clsx, type ClassValue } from "clsx"

// ============================================
// Funcția "cn" - Combină Nume de Clase CSS
// ============================================
// Această funcție primește mai multe clase CSS și le combină într-un singur string.
// Este foarte utilă când vrem să adăugăm clase CSS condiționat.
// Exemplu: cn("text-red", isActive && "font-bold") => "text-red font-bold" sau "text-red"
//
// "...inputs" se numește "rest parameter" - înseamnă că funcția
// poate primi oricâte argumente, și le pune pe toate într-un array.
export function cn(...inputs: ClassValue[]) {
  // clsx combină toate clasele primite într-un singur string,
  // eliminând valorile false/null/undefined automat
  return clsx(inputs)
}

// ============================================
// Funcția "generateSlug" - Generează un Slug din Text
// ============================================
// Un "slug" este o versiune a textului potrivită pentru URL-uri.
// Exemplu: "Nuntă la Mare" devine "nunta-la-mare"
// Slug-urile nu au spații, diacritice sau caractere speciale.
//
// Primește un text (string) și returnează tot un string.
export function generateSlug(text: string): string {
  return text
    // .toLowerCase() - Transformă toate literele în minuscule
    // Exemplu: "Nuntă La Mare" => "nuntă la mare"
    .toLowerCase()

    // .normalize("NFD") - Descompune caracterele cu diacritice în părțile lor componente
    // Exemplu: "ă" devine "a" + semnul diacritic separat
    // Acest lucru ne permite să eliminăm diacriticele în pasul următor
    .normalize("NFD")

    // Eliminăm diacriticele (semnele de pe litere: ă, î, ș, ț, â)
    // Regex-ul /[\u0300-\u036f]/g selectează toate semnele diacritice
    // "g" la final înseamnă "global" - caută în tot textul, nu doar prima potrivire
    .replace(/[\u0300-\u036f]/g, "")

    // Eliminăm caracterele speciale (tot ce NU este literă, cifră, spațiu sau cratimă)
    // \w = litere și cifre, \s = spații, - = cratimă
    // ^ în interiorul [] înseamnă "tot ce NU este..."
    .replace(/[^\w\s-]/g, '')

    // Înlocuim spațiile cu cratime (-)
    // \s+ înseamnă "unul sau mai multe spații"
    .replace(/\s+/g, '-')

    // Înlocuim cratimele multiple cu o singură cratimă
    // --+ înseamnă "două sau mai multe cratime consecutive"
    .replace(/--+/g, '-')

    // .trim() - Elimină spațiile de la începutul și sfârșitul textului
    .trim()
}

// ============================================
// Funcția "formatFileSize" - Formatează Dimensiunea unui Fișier
// ============================================
// Transformă un număr de bytes într-un format ușor de citit.
// Exemplu: 1024 => "1 KB", 1048576 => "1 MB"
//
// Primește un număr (bytes) și returnează un string formatat.
export function formatFileSize(bytes: number): string {
  // Dacă dimensiunea este 0, returnăm direct "0 Bytes"
  if (bytes === 0) return '0 Bytes'

  // k = 1024 - acesta este factorul de conversie între unități
  // (1 KB = 1024 Bytes, 1 MB = 1024 KB, etc.)
  const k = 1024

  // Lista cu unitățile de măsură, în ordine crescătoare
  const sizes = ['Bytes', 'KB', 'MB', 'GB']

  // Calculăm care este unitatea potrivită folosind logaritmi.
  // Math.log(bytes) / Math.log(k) ne spune de câte ori trebuie
  // să împărțim la 1024 ca să ajungem la unitatea corectă.
  // Math.floor rotunjește în jos la cel mai apropiat număr întreg.
  // Exemplu: pentru 1500 bytes, i = 1 (adică KB)
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  // Calculăm valoarea finală:
  // - bytes / Math.pow(k, i) = împărțim bytes la 1024^i
  // - .toFixed(2) = rotunjim la 2 zecimale
  // - parseFloat elimină zerourile inutile de la final (ex: "1.00" => "1")
  // - Adăugăm unitatea de măsură la final
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ============================================
// Funcția "isValidImageType" - Verifică Tipul Imaginii
// ============================================
// Verifică dacă un fișier este o imagine de tip acceptat.
// Returnează true (adevărat) dacă tipul este valid, false (fals) dacă nu.
//
// Tipurile acceptate sunt: JPEG, JPG, PNG și WebP.
// "type" este tipul MIME al fișierului (ex: "image/jpeg").
export function isValidImageType(type: string): boolean {
  // .includes(type) verifică dacă tipul primit se află în lista de tipuri acceptate
  return ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type)
}
