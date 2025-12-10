/**
 * Exemples d'utilisation des opérateurs pipe avec Drino
 */

import drino from '../src';
import {
  mapResult,
  tapResult,
  reportError,
  finalize,
  onAbort,
  onRetry,
  onDownload,
  type PipeFunction
} from '../src';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page: number;
  };
}

// ============================================
// Exemple 1 : Transformation simple
// ============================================

async function example1() {
  const userNames = await drino
    .get<User[]>('/api/users')
    .pipe(
      mapResult(users => users.filter(u => u.active)),
      mapResult(users => users.map(u => u.name))
    )
    .consume();

  console.log('Active user names:', userNames);
}

// ============================================
// Exemple 2 : Logging et monitoring
// ============================================

async function example2() {
  await drino
    .get<User>('/api/user/123')
    .pipe(
      tapResult(user => console.log('User loaded:', user)),
      tapResult(user => {
        // Envoyer à un service d'analytics
        // analytics.track('user_loaded', { userId: user.id });
      }),
      reportError(err => console.error('Failed to load user:', err)),
      finalize(() => console.log('Request completed'))
    )
    .consume();
}

// ============================================
// Exemple 3 : Extraction de données imbriquées
// ============================================

async function example3() {
  const users = await drino
    .get<ApiResponse<User[]>>('/api/users')
    .pipe(
      tapResult(response => console.log('Total users:', response.meta.total)),
      mapResult(response => response.data)
    )
    .consume();

  console.log('Users:', users);
}

// ============================================
// Exemple 4 : Gestion d'erreurs avancée
// ============================================

async function example4() {
  try {
    await drino
      .post('/api/data', { value: 123 })
      .pipe(
        tapResult(result => console.log('Success:', result)),
        reportError(err => {
          // Log l'erreur
          console.error('API Error:', err);

          // Notifier l'utilisateur
          // showNotification('error', 'Request failed');

          // Envoyer à un service de monitoring
          // sentry.captureException(err);
        }),
        finalize(() => {
          // Nettoyer les ressources
          // hideLoadingSpinner();
        })
      )
      .consume();
  } catch (error) {
    console.error('Caught error:', error);
  }
}

// ============================================
// Exemple 5 : Suivi de progression
// ============================================

async function example5() {
  await drino
    .get('/api/large-file')
    .pipe(
      onDownload(event => {
        const percent = Math.round((event.loaded / event.total) * 100);
        console.log(`Download progress: ${percent}%`);
        // updateProgressBar(percent);
      }),
      tapResult(() => console.log('Download complete!'))
    )
    .consume();
}

// ============================================
// Exemple 6 : Gestion des retries
// ============================================

async function example6() {
  const instance = drino.create({
    retry: {
      maxRetries: 3,
      delay: 1000
    }
  });

  await instance
    .get('/api/unstable-endpoint')
    .pipe(
      onRetry(event => {
        console.log(`Retry ${event.attempt}/${event.maxRetries}`);
        console.log(`Waiting ${event.delay}ms before next attempt`);
      }),
      tapResult(result => console.log('Success after retries:', result)),
      reportError(err => console.error('Failed after all retries:', err))
    )
    .consume();
}

// ============================================
// Exemple 7 : Gestion d'annulation
// ============================================

async function example7() {
  const abortController = new AbortController();

  // Simuler une annulation après 2 secondes
  setTimeout(() => {
    abortController.abort('User cancelled the request');
  }, 2000);

  await drino
    .get('/api/slow-endpoint', { signal: abortController.signal })
    .pipe(
      onAbort(reason => console.log('Request aborted:', reason)),
      tapResult(result => console.log('Result:', result)),
      finalize(() => console.log('Cleanup completed'))
    )
    .consume();
}

// ============================================
// Exemple 8 : Créer un opérateur personnalisé
// ============================================

// Opérateur pour extraire un champ
function extractField<T, K extends keyof T>(field: K): PipeFunction<T, T[K]> {
  return (source) => source.clone().transform(obj => obj[field]);
}

// Opérateur pour valider les données
function validate<T>(validator: (data: T) => boolean, errorMsg: string): PipeFunction<T, T> {
  return (source) => source.clone().transform(data => {
    if (!validator(data)) {
      throw new Error(errorMsg);
    }
    return data;
  });
}

async function example8() {
  const userData = await drino
    .get<ApiResponse<User>>('/api/current-user')
    .pipe(
      extractField('data'),
      validate(
        user => user.active,
        'User account is not active'
      ),
      tapResult(user => console.log('Valid user:', user))
    )
    .consume();

  console.log('User data:', userData);
}

// ============================================
// Exemple 9 : Pipeline réutilisable
// ============================================

// Créer un pipeline réutilisable
const withLogging = <T>() => (source: ReturnType<typeof drino.get<T>>) =>
  source.pipe(
    tapResult(result => console.log('[Result]', result)),
    reportError(err => console.error('[Error]', err)),
    finalize(() => console.log('[Finished]'))
  );

async function example9() {
  const loadUser = drino.get<User>('/api/user/123');

  // Appliquer le pipeline
  await withLogging<User>()(loadUser).consume();
}

// ============================================
// Exemple 10 : Composition complexe
// ============================================

async function example10() {
  const activeUserEmails = await drino
    .get<ApiResponse<User[]>>('/api/users')
    .pipe(
      // Log la réponse complète
      tapResult(response => console.log('API Response:', response)),

      // Extraire les données
      mapResult(response => response.data),

      // Filtrer les utilisateurs actifs
      mapResult(users => users.filter(u => u.active)),

      // Trier par nom
      mapResult(users => users.sort((a, b) => a.name.localeCompare(b.name))),

      // Extraire les emails
      mapResult(users => users.map(u => u.email)),

      // Log le résultat final
      tapResult(emails => console.log('Active user emails:', emails)),

      // Gestion d'erreurs
      reportError(err => {
        console.error('Failed to get user emails:', err);
        // sendErrorToMonitoring(err);
      }),

      // Cleanup
      finalize(() => console.log('User email fetch completed'))
    )
    .consume();

  return activeUserEmails;
}

// Exécuter les exemples
async function runExamples() {
  console.log('\n=== Example 1: Simple transformation ===');
  // await example1();

  console.log('\n=== Example 2: Logging and monitoring ===');
  // await example2();

  console.log('\n=== Example 3: Nested data extraction ===');
  // await example3();

  console.log('\n=== Example 4: Advanced error handling ===');
  // await example4();

  console.log('\n=== Example 5: Progress tracking ===');
  // await example5();

  console.log('\n=== Example 6: Retry handling ===');
  // await example6();

  console.log('\n=== Example 7: Cancellation ===');
  // await example7();

  console.log('\n=== Example 8: Custom operators ===');
  // await example8();

  console.log('\n=== Example 9: Reusable pipeline ===');
  // await example9();

  console.log('\n=== Example 10: Complex composition ===');
  // await example10();
}

// runExamples();
