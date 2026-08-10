import { Injectable, computed, signal } from '@angular/core';
import { Product } from './product';

const PRODUTOS_INICIAIS: Product[] = [
  {
    id: 1,
    name: 'Naruto',
    description: 'Obra de Masashi Kishimoto — o ninja da Vila da Folha',
    category: 'Shonen',
    price: 39.9,
    image: 'images/Naruto.jpg',
    stock: 10,
    rating: 4.8,
    hidden: false,
    promotion: true,
  },
  {
    id: 2,
    name: 'Bleach',
    description: 'Obra de Tite Kubo — o shinigami substituto Ichigo',
    category: 'Shonen',
    price: 44.9,
    image: 'images/Bleach.jpg',
    stock: 8,
    rating: 4.6,
    hidden: false,
    promotion: false,
  },
  {
    id: 3,
    name: 'Dragon Ball',
    description: 'Obra de Akira Toriyama — o guerreiro Saiyajin Goku',
    category: 'Shonen',
    price: 49.9,
    image: 'images/Dragon Ball.jpg',
    stock: 5,
    rating: 4.9,
    hidden: false,
    promotion: false,
  },
  {
    id: 4,
    name: 'One Piece',
    description: 'Obra de Eiichiro Oda — o pirata do chapéu de palha',
    category: 'Shonen',
    price: 42.9,
    image: 'images/One Piece.jpg',
    stock: 0,
    rating: 4.9,
    hidden: false,
    promotion: false,
  },
  {
    id: 5,
    name: 'Fullmetal Alchemist Brotherhood',
    description: 'Obra de Hiromu Arakawa — os irmãos alquimistas',
    category: 'Shonen',
    price: 54.9,
    image: 'images/Fullmetal Alchemist.jpg',
    stock: 12,
    rating: 4.9,
    hidden: false,
    promotion: false,
  },
  {
    id: 6,
    name: 'Shaman King',
    description: 'Obra de Hiroyuki Takei — o xamã Yoh Asakura',
    category: 'Shonen',
    price: 39.9,
    image: 'images/Shaman King.jpg',
    stock: 3,
    rating: 4.3,
    hidden: false,
    promotion: false,
  },
  {
    id: 7,
    name: 'Demon Slayer',
    description: 'Obra de Koyoharu Gotouge — Tanjiro, o caçador de onis',
    category: 'Shonen',
    price: 34.9,
    image: 'images/Demon Slayer.png',
    stock: 20,
    rating: 4.7,
    hidden: false,
    promotion: true,
  },
  {
    id: 8,
    name: 'Jujutsu Kaisen',
    description: 'Obra de Gege Akutami — feiticeiros contra maldições',
    category: 'Shonen',
    price: 34.9,
    image: 'images/Jujutsu Kaisen.png',
    stock: 30,
    rating: 4.8,
    hidden: false,
    promotion: false,
  },
  {
    id: 9,
    name: 'Samurai X',
    description: 'Obra de Nobuhiro Watsuki — o andarilho da era Meiji',
    category: 'Clássico',
    price: 59.9,
    image: 'images/Samurai X.jpg',
    stock: 15,
    rating: 4.5,
    hidden: false,
    promotion: false,
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly storageKey = 'shogun-products';
  private readonly products = signal<Product[]>(this.load());

  readonly todos = computed(() => this.products());
  readonly visiveis = computed(() => this.products().filter((p) => !p.hidden));

  buscarPorId(id: number): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  criar(dados: Omit<Product, 'id'>): void {
    const novo: Product = { ...dados, id: this.proximoId() };
    this.products.update((lista) => [...lista, novo]);
    this.save();
  }

  atualizar(product: Product): void {
    this.products.update((lista) => lista.map((p) => (p.id === product.id ? product : p)));
    this.save();
  }

  deletar(id: number): void {
    this.products.update((lista) => lista.filter((p) => p.id !== id));
    this.save();
  }

  alternarVisibilidade(id: number): void {
    this.update(id, (p) => ({ ...p, hidden: !p.hidden }));
  }

  alternarPromocao(id: number): void {
    this.update(id, (p) => ({ ...p, promotion: !p.promotion }));
  }

  diminuirEstoque(id: number, quantidade: number): void {
    this.update(id, (p) => ({ ...p, stock: Math.max(0, p.stock - quantidade) }));
  }

  devolverEstoque(id: number, quantidade: number): void {
    this.update(id, (p) => ({ ...p, stock: p.stock + quantidade }));
  }

  private update(id: number, fn: (p: Product) => Product): void {
    this.products.update((lista) => lista.map((p) => (p.id === id ? fn(p) : p)));
    this.save();
  }

  private proximoId(): number {
    return this.products().reduce((maior, p) => Math.max(maior, p.id), 0) + 1;
  }

  private load(): Product[] {
    try {
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) return JSON.parse(salvo) as Product[];
    } catch {
      /* primeiro acesso */
    }
    return PRODUTOS_INICIAIS;
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.products()));
  }
}
