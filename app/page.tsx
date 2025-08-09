'use client';

import React, { useEffect, useMemo, useState } from 'react';

// ---------------------------------------------
// Utilidades simples
// ---------------------------------------------
const PESO = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

const isBrowser = typeof window !== 'undefined';

const LS = {
  get<T>(k: string, def: T): T {
    if (!isBrowser) return def;
    try {
      const v = window.localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : def;
    } catch {
      return def;
    }
  },
  set<T>(k: string, v: T) {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

// ---------------------------------------------
// Tipos
// ---------------------------------------------
type MenuItem = {
  id: string;
  nombre: string;
  desc: string;
  precio: number;
  etiqueta: string;
};

type CartItem = MenuItem & { cantidad: number };

type User = { nombre: string; email: string } | null;

type Direccion = {
  calle: string;
  numero: string;
  colonia: string;
  cp: string;
  referencias?: string;
} | null;

// ---------------------------------------------
// Datos
// ---------------------------------------------
const MENU: MenuItem[] = [
  {
    id: 't-veracruzano',
    nombre: 'Tamal Veracruzano',
    desc: 'Clásico envuelto en hoja de plátano.',
    precio: 32,
    etiqueta: 'Tradicional',
  },
  {
    id: 't-rajas',
    nombre: 'Tamal de Rajas con Queso',
    desc: 'Relleno de rajas y queso fresco.',
    precio: 34,
    etiqueta: 'Suave',
  },
  {
    id: 't-mole',
    nombre: 'Tamal de Mole',
    desc: 'Mole casero ligeramente picosito.',
    precio: 36,
    etiqueta: 'Favorito',
  },
  {
    id: 't-dulce',
    nombre: 'Tamal Dulce (fresa)',
    desc: 'Dulce y esponjoso para acompañar el café.',
    precio: 30,
    etiqueta: 'Dulce',
  },
  {
    id: 'atole',
    nombre: 'Atole de Vainilla',
    desc: 'Calientito y cremoso.',
    precio: 28,
    etiqueta: 'Bebida',
  },
  {
    id: 'champurrado',
    nombre: 'Champurrado',
    desc: 'Chocolate y maíz, receta de casa.',
    precio: 30,
    etiqueta: 'Bebida',
  },
];

const ZONAS = [
  'Ecatepec de Morelos (centro)',
  'San Cristóbal Centro',
  'Ciudad Azteca',
  'Jardines de Morelos',
  'Las Américas',
  'Santa Clara Coatitla',
  'Xalostoc',
  'Nezahualcóyotl (frontera norte, cobertura limitada)',
];

const TESTIMONIOS = [
  {
    n: 'María Fernanda R.',
    t: 'Los tamales veracruzanos saben a hogar. Entrega rapidísima en Jardines de Morelos.',
  },
  { n: 'Juan Carlos M.', t: 'El de mole está brutal. Pagos en línea sin complicaciones.' },
  { n: 'Itzel G.', t: 'Me encantó el champurrado, perfecto para la mañana. Repetiré.' },
  { n: 'Rodrigo A.', t: 'Excelente servicio y muy buen precio. Llegó calientito a Ciudad Azteca.' },
];

// ---------------------------------------------
// Componentes pequeños sin dependencias externas
// ---------------------------------------------
function Logo() {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Lettermark TD */}
      <div className="h-10 w-10 rounded-2xl bg-green-700 text-white grid place-items-center font-extrabold">
        TD
      </div>
      <div className="leading-tight">
        <div className="text-xl font-extrabold text-green-900">Tamales Dali</div>
        <div className="text-xs text-green-700">Sabor veracruzano • Hecho a mano</div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-green-700 px-2 py-0.5 text-xs font-semibold text-white">
      {children}
    </span>
  );
}

function Button({
  children,
  onClick,
  variant = 'solid',
  className = '',
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}) {
  const base =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition';
  const map = {
    solid: 'bg-green-700 text-white hover:bg-green-800',
    outline: 'border border-green-700 text-green-800 hover:bg-green-50',
    ghost: 'text-green-800 hover:bg-green-50',
  };
  return (
    <button type={type ?? 'button'} onClick={onClick} className={`${base} ${map[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`rounded-2xl border border-green-200 ${className}`}>{children}</div>;
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-4 pb-2">{children}</div>;
}
function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-green-900 font-bold ${className}`}>{children}</div>;
}
function CardDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-green-800 text-sm">{children}</div>;
}
function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pb-4">{children}</div>;
}
function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pb-4">{children}</div>;
}

// ---------------------------------------------
// Secciones
// ---------------------------------------------
function Hero({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 p-6 md:p-10">
      <Badge>Cocina veracruzana</Badge>
      <h1 className="mt-4 text-3xl md:text-5xl font-extrabold text-green-900">
        Tamales tradicionales en hoja de plátano
      </h1>
      <p className="mt-3 text-green-800 max-w-2xl">
        Pide en línea, paga en línea y recibe en tu domicilio cerca de Ecatepec. Calientitos, seguros y a tiempo.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onOrderClick}>Ordenar ahora</Button>
        <a href="#zonas" className="inline-flex items-center text-green-800 font-medium">
          Ver zonas de entrega
        </a>
      </div>

      <div className="absolute -right-8 -bottom-8 opacity-10 rotate-6 text-[200px] font-black text-green-900 select-none">
        TD
      </div>
    </section>
  );
}

function Menu({ addToCart }: { addToCart: (i: MenuItem) => void }) {
  return (
    <section id="menu" className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-green-700" />
        <h2 className="text-2xl font-bold text-green-900">Menú</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {MENU.map((i) => (
          <Card key={i.id} className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {i.nombre} <Badge>{i.etiqueta}</Badge>
              </CardTitle>
              <CardDescription>{i.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-900">{PESO(i.precio)}</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => addToCart(i)}>
                Agregar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Zonas() {
  return (
    <section id="zonas" className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-green-700" />
        <h2 className="text-2xl font-bold text-green-900">Zonas de entrega (cerca de Ecatepec)</h2>
      </div>
      <Card className="border-green-200">
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-2">
            {ZONAS.map((z) => (
              <li key={z} className="text-green-900">
                • {z}
              </li>
            ))}
          </ul>
          <p className="text-xs text-green-700 mt-3">
            * Cobertura sujeta a disponibilidad y distancia. Si tu zona no aparece, contáctanos por WhatsApp.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function Testimonios() {
  return (
    <section id="testimonios" className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-green-700" />
        <h2 className="text-2xl font-bold text-green-900">Lo que dice la banda</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {TESTIMONIOS.map((t, idx) => (
          <Card key={idx} className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">{t.n}</CardTitle>
              <CardDescription>Cliente verificado en Ecatepec</CardDescription>
            </CardHeader>
            <CardContent className="text-green-900">“{t.t}”</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-green-200 pt-6 pb-10 text-green-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm">
          Pagos <b>solo en línea</b> con tarjeta o transferencia.
        </div>
        <div className="text-sm">Envíos el mismo día (según disponibilidad).</div>
        <div className="text-sm">Higiene y calidad garantizada.</div>
      </div>
      <div className="mt-6 flex items-center gap-2 text-green-900">
        Próximamente: <b>Uber Eats</b>
        <span className="text-xs text-green-700">(Coming soon)</span>
      </div>
      <p className="text-xs text-green-700 mt-3">
        © {new Date().getFullYear()} Tamales Dali. Todos los derechos reservados.
      </p>
    </footer>
  );
}

// ---------------------------------------------
// Overlay Carrito (sin librerías)
// ---------------------------------------------
function CartSheet({
  open,
  onClose,
  carrito,
  setCarrito,
  direccion,
  onPay,
}: {
  open: boolean;
  onClose: () => void;
  carrito: CartItem[];
  setCarrito: (c: CartItem[]) => void;
  direccion: Direccion;
  onPay: () => void;
}) {
  const total = useMemo(
    () => carrito.reduce((s, i) => s + i.precio * i.cantidad, 0),
    [carrito]
  );

  const actualizarCant = (id: string, delta: number) => {
    const next = carrito.map((i) =>
      i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i
    );
    setCarrito(next);
  };
  const quitar = (id: string) => setCarrito(carrito.filter((i) => i.id !== id));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b border-green-200 flex items-center justify-between">
          <div className="font-bold">Tu carrito</div>
          <button onClick={onClose} className="text-green-800 hover:underline">
            Cerrar
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {carrito.length === 0 && (
            <div className="text-sm text-green-700">Aún no agregas productos.</div>
          )}

          {carrito.map((i) => (
            <Card key={i.id} className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{i.nombre}</CardTitle>
                <CardDescription>{PESO(i.precio)} c/u</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => actualizarCant(i.id, -1)}>
                      -
                    </Button>
                    <span>{i.cantidad}</span>
                    <Button variant="outline" onClick={() => actualizarCant(i.id, 1)}>
                      +
                    </Button>
                  </div>
                  <div className="font-bold text-green-900">{PESO(i.cantidad * i.precio)}</div>
                </div>
              </CardContent>
              <CardFooter>
                <button className="text-red-600 text-sm" onClick={() => quitar(i.id)}>
                  Quitar
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="p-4 border-t border-green-200 space-y-3">
          <div className="flex items-center justify-between text-green-900 font-bold">
            <span>Total</span>
            <span>{PESO(total)}</span>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              if (!direccion?.calle) {
                alert('Agrega tu dirección antes de pagar.');
                return;
              }
              onPay();
            }}
          >
            Pagar en línea
          </Button>
          <p className="text-xs text-green-700">
            Pagos solo en línea. Al pagar aceptas nuestros términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// Cuenta y Dirección (localStorage)
// ---------------------------------------------
function CuentaDireccion({
  user,
  setUser,
  direccion,
  setDireccion,
}: {
  user: User;
  setUser: (u: User) => void;
  direccion: Direccion;
  setDireccion: (d: Direccion) => void;
}) {
  const [tab, setTab] = useState<'cuenta' | 'direccion'>('cuenta');

  const guardarCuenta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const u: User = {
      nombre: String(data.get('nombre') || ''),
      email: String(data.get('email') || ''),
    };
    setUser(u);
    LS.set('td_user', u);
    alert('Cuenta guardada');
  };

  const cerrarSesion = () => {
    setUser(null);
    LS.set('td_user', null);
    alert('Sesión cerrada');
  };

  const guardarDireccion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const d: Direccion = {
      calle: String(data.get('calle') || ''),
      numero: String(data.get('numero') || ''),
      colonia: String(data.get('colonia') || ''),
      cp: String(data.get('cp') || ''),
      referencias: String(data.get('referencias') || ''),
    };
    setDireccion(d);
    LS.set('td_direccion', d);
    alert('Dirección guardada');
  };

  return (
    <section id="cuenta" className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-green-700" />
        <h2 className="text-2xl font-bold text-green-900">Tu cuenta y entrega a domicilio</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          className={`rounded-lg px-3 py-1 text-sm ${
            tab === 'cuenta' ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800'
          }`}
          onClick={() => setTab('cuenta')}
        >
          Cuenta
        </button>
        <button
          className={`rounded-lg px-3 py-1 text-sm ${
            tab === 'direccion' ? 'bg-green-700 text-white' : 'bg-green-100 text-green-800'
          }`}
          onClick={() => setTab('direccion')}
        >
          Dirección
        </button>
      </div>

      {tab === 'cuenta' ? (
        !user ? (
          <Card className="border-green-200 mt-4">
            <CardHeader>
              <CardTitle>Crear cuenta</CardTitle>
              <CardDescription>Regístrate para guardar tu dirección y pedidos.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={guardarCuenta} className="grid md:grid-cols-2 gap-3">
                <input
                  required
                  name="nombre"
                  placeholder="Nombre completo"
                  className="rounded-lg border border-green-300 p-2"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Correo electrónico"
                  className="rounded-lg border border-green-300 p-2"
                />
                <Button type="submit" className="md:col-span-2">
                  Crear cuenta
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 mt-4">
            <CardHeader>
              <CardTitle>Hola, {user.nombre}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" onClick={cerrarSesion}>
                Cerrar sesión
              </Button>
            </CardFooter>
          </Card>
        )
      ) : (
        <Card className="border-green-200 mt-4">
          <CardHeader>
            <CardTitle>Dirección de entrega</CardTitle>
            <CardDescription>Entrega a domicilio disponible en zonas cercanas a Ecatepec.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={guardarDireccion} className="grid md:grid-cols-2 gap-3">
              <input
                required
                name="calle"
                placeholder="Calle"
                defaultValue={direccion?.calle || ''}
                className="rounded-lg border border-green-300 p-2"
              />
              <input
                required
                name="numero"
                placeholder="Número"
                defaultValue={direccion?.numero || ''}
                className="rounded-lg border border-green-300 p-2"
              />
              <input
                required
                name="colonia"
                placeholder="Colonia"
                defaultValue={direccion?.colonia || ''}
                className="rounded-lg border border-green-300 p-2"
              />
              <input
                required
                name="cp"
                placeholder="Código Postal"
                defaultValue={direccion?.cp || ''}
                className="rounded-lg border border-green-300 p-2"
              />
              <textarea
                name="referencias"
                placeholder="Referencias (opcional)"
                defaultValue={direccion?.referencias || ''}
                className="md:col-span-2 rounded-lg border border-green-300 p-2"
              />
              <Button type="submit" className="md:col-span-2">
                Guardar dirección
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

// ---------------------------------------------
// App principal (Página)
// ---------------------------------------------
export default function Page() {
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [direccion, setDireccion] = useState<Direccion>(null);

  useEffect(() => {
    setUser(LS.get<User>('td_user', null));
    setDireccion(LS.get<Direccion>('td_direccion', null));
  }, []);

  const addToCart = (item: MenuItem) => {
    setCarrito((prev) => {
      const ex = prev.find((p) => p.id === item.id);
      if (ex) return prev.map((p) => (p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p));
      return [...prev, { ...item, cantidad: 1 }];
    });
    setOpenCart(true);
  };

  const afterPay = () => {
    alert('Pago procesado correctamente. ¡Gracias!');
    setOpenCart(false);
    setCarrito([]);
  };

  return (
    <div className="min-h-screen bg-white text-green-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-green-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <a href="#menu" className="text-sm text-green-800 hidden md:inline">
              Menú
            </a>
            <a href="#zonas" className="text-sm text-green-800 hidden md:inline">
              Zonas
            </a>
            <a href="#testimonios" className="text-sm text-green-800 hidden md:inline">
              Testimonios
            </a>
            <a href="#cuenta" className="text-sm text-green-800 hidden md:inline">
              Cuenta
            </a>
            <Button variant="outline" onClick={() => setOpenCart(true)}>
              Carrito ({carrito.length})
            </Button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Hero onOrderClick={() => setOpenCart(true)} />
        <Menu addToCart={addToCart} />
        <CuentaDireccion user={user} setUser={setUser} direccion={direccion} setDireccion={setDireccion} />
        <Zonas />
        <Testimonios />
        <section className="mt-10">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle>Próximamente en Uber Eats</CardTitle>
              <CardDescription>Muy pronto podrás pedir Tamales Dali desde Uber Eats.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="text-green-800">
                Entérame cuando esté listo
              </Button>
            </CardFooter>
          </Card>
        </section>
        <Footer />
      </main>

      {/* Carrito */}
      <CartSheet
        open={openCart}
        onClose={() => setOpenCart(false)}
        carrito={carrito}
        setCarrito={setCarrito}
        direccion={direccion}
        onPay={afterPay}
      />
    </div>
  );
}
