import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PRODUCTS } from '../data/products';

const OrderContext = createContext(null);
const STORAGE_KEY = 'mira_orders';

// Initial seed orders for realistic demonstration
const SEED_ORDERS = [
  {
    orderNumber: 'MIRA-849201',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago
    status: 'in_transit', // 'confirmed' | 'in_atelier' | 'in_transit' | 'out_for_delivery' | 'delivered'
    statusLabel: 'In Transit with Courier',
    statusDescription: 'Package departed regional logistics hub. Carbon-neutral transit in progress.',
    carrier: 'DHL Express Carbon-Neutral',
    trackingNumber: 'DHL-ECO-98421049',
    estimatedDelivery: 'Tomorrow by 5:00 PM',
    shippingAddress: {
      name: 'Sophia Laurent',
      address: '142 Mercer Street',
      apartment: 'Apt 4B',
      city: 'New York',
      postalCode: '10012',
      country: 'United States',
      email: 'sophia.laurent@example.com'
    },
    paymentMethod: 'online',
    paymentLabel: 'Online Payment (Verified)',
    paymentMasked: 'Mastercard ending in •••• 4242',
    subtotal: 360,
    shippingCost: 0,
    total: 360,
    items: [
      {
        id: 'mira-w-01',
        name: 'Aria Cashmere Turtleneck',
        slug: 'aria-cashmere-turtleneck',
        price: 245,
        selectedColor: 'Oatmeal',
        selectedSize: 'M',
        quantity: 1,
        image: PRODUCTS.find(p => p.id === 'mira-w-01')?.image || ''
      },
      {
        id: 'mira-a-04',
        name: 'Aura Minimalist Leather Cardholder',
        slug: 'aura-minimalist-leather-cardholder',
        price: 70,
        selectedColor: 'Caramel',
        selectedSize: 'One Size',
        quantity: 1,
        image: PRODUCTS.find(p => p.id === 'mira-a-04')?.image || ''
      }
    ],
    timeline: [
      {
        stage: 'confirmed',
        title: 'Order Confirmed',
        description: 'Payment authorized & verified.',
        time: new Date(Date.now() - 36 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true
      },
      {
        stage: 'in_atelier',
        title: 'Tailored & Inspected',
        description: 'Passed 12-point studio quality audit in Florence Atelier.',
        time: new Date(Date.now() - 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true
      },
      {
        stage: 'in_transit',
        title: 'Dispatched in Transit',
        description: 'Departed JFK Logistics Centre via EV parcel carrier.',
        time: new Date(Date.now() - 10 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true
      },
      {
        stage: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier assigned for local route.',
        time: 'Pending',
        completed: false
      },
      {
        stage: 'delivered',
        title: 'Delivered',
        description: 'Direct doorstep handover with signature.',
        time: 'Pending',
        completed: false
      }
    ]
  },
  {
    orderNumber: 'MIRA-617392',
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(), // 8 days ago
    status: 'delivered',
    statusLabel: 'Delivered & Handed Over',
    statusDescription: 'Package handed directly to resident. Signed by S. Laurent.',
    carrier: 'DHL Express Carbon-Neutral',
    trackingNumber: 'DHL-ECO-31048821',
    estimatedDelivery: 'Delivered 6 days ago',
    shippingAddress: {
      name: 'Sophia Laurent',
      address: '142 Mercer Street',
      apartment: 'Apt 4B',
      city: 'New York',
      postalCode: '10012',
      country: 'United States',
      email: 'sophia.laurent@example.com'
    },
    paymentMethod: 'cod',
    paymentLabel: 'Cash on Delivery (COD)',
    paymentMasked: 'Cash Collected upon Handover',
    subtotal: 420,
    shippingCost: 0,
    total: 420,
    items: [
      {
        id: 'mira-m-02',
        name: 'Vanguard Relaxed Trench Coat',
        slug: 'vanguard-relaxed-trench-coat',
        price: 495,
        selectedColor: 'British Khaki',
        selectedSize: 'L',
        quantity: 1,
        image: PRODUCTS.find(p => p.id === 'mira-m-02')?.image || ''
      }
    ],
    timeline: [
      {
        stage: 'confirmed',
        title: 'Order Confirmed',
        description: 'COD request verified with mobile SMS check.',
        time: 'Oct 13, 09:15 AM',
        completed: true
      },
      {
        stage: 'in_atelier',
        title: 'Crafted & Packed',
        description: 'Packed in biodegradable organic cotton garment bag.',
        time: 'Oct 13, 03:40 PM',
        completed: true
      },
      {
        stage: 'in_transit',
        title: 'In Transit',
        description: 'Cross-continental carbon offset flight.',
        time: 'Oct 14, 08:20 AM',
        completed: true
      },
      {
        stage: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier en route to Mercer St.',
        time: 'Oct 15, 10:10 AM',
        completed: true
      },
      {
        stage: 'delivered',
        title: 'Delivered & Collected',
        description: 'Delivered at 01:25 PM. Payment settled in cash upon receipt.',
        time: 'Oct 15, 01:25 PM',
        completed: true
      }
    ]
  }
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('mira_orders_updated'));
    } catch (e) {
      console.warn('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  // Sync across browser tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Add newly created order from checkout
  const addOrder = useCallback((orderSnapshot) => {
    const newOrderNumber = orderSnapshot.orderNumber.startsWith('MIRA-')
      ? orderSnapshot.orderNumber
      : `MIRA-${orderSnapshot.orderNumber}`;

    const newOrder = {
      orderNumber: newOrderNumber,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      statusLabel: 'Order Confirmed',
      statusDescription: orderSnapshot.paymentMethod === 'cod'
        ? 'Order placed with Cash on Delivery. Preparing for atelier production.'
        : 'Payment received. Order transmitted to our European atelier.',
      carrier: 'DHL Express Carbon-Neutral',
      trackingNumber: `DHL-ECO-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: '3 to 5 Business Days',
      shippingAddress: orderSnapshot.shippingAddress,
      paymentMethod: orderSnapshot.paymentMethod || 'online',
      paymentLabel: orderSnapshot.paymentLabel || 'Online Payment',
      paymentMasked: orderSnapshot.paymentMasked || 'Card payment',
      subtotal: orderSnapshot.subtotal,
      shippingCost: orderSnapshot.shippingCost,
      total: orderSnapshot.total,
      items: orderSnapshot.items,
      timeline: [
        {
          stage: 'confirmed',
          title: 'Order Confirmed',
          description: orderSnapshot.paymentMethod === 'cod' ? 'Cash on Delivery booked.' : 'Payment processed & approved.',
          time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          completed: true
        },
        {
          stage: 'in_atelier',
          title: 'Atelier Tailoring',
          description: 'Garments moving to precision cutting & steaming.',
          time: 'Est. tomorrow',
          completed: false
        },
        {
          stage: 'in_transit',
          title: 'Dispatched in Transit',
          description: 'Courier pickup and flight boarding.',
          time: 'Est. 2 days',
          completed: false
        },
        {
          stage: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Local doorstep dispatch.',
          time: 'Est. 3 days',
          completed: false
        },
        {
          stage: 'delivered',
          title: 'Delivered',
          description: 'Handover & confirmation.',
          time: 'Est. 4-5 days',
          completed: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // Lookup order by ID
  const getOrderById = useCallback((lookupId) => {
    if (!lookupId) return null;
    const cleanId = lookupId.trim().toUpperCase().replace(/^#/, '');
    return orders.find(o =>
      o.orderNumber.toUpperCase() === cleanId ||
      o.orderNumber.toUpperCase().replace('MIRA-', '') === cleanId
    ) || null;
  }, [orders]);

  // Interactive simulation tool: Advance order status to next stage
  const advanceOrderStatus = useCallback((orderNumber) => {
    setOrders(prev => prev.map(order => {
      if (order.orderNumber !== orderNumber) return order;

      const STAGES = ['confirmed', 'in_atelier', 'in_transit', 'out_for_delivery', 'delivered'];
      const currentIndex = STAGES.indexOf(order.status);
      if (currentIndex === -1 || currentIndex >= STAGES.length - 1) return order;

      const nextStage = STAGES[currentIndex + 1];
      const nowFormatted = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const updatedTimeline = order.timeline.map(step => {
        if (step.stage === nextStage) {
          return { ...step, completed: true, time: nowFormatted };
        }
        return step;
      });

      const labels = {
        in_atelier: {
          label: 'In Atelier Tailoring',
          desc: 'Garments being finished and steamed in sustainable atelier.'
        },
        in_transit: {
          label: 'In Transit with Courier',
          desc: 'Package dispatched via DHL Express Carbon-Neutral air transit.'
        },
        out_for_delivery: {
          label: 'Out for Delivery Today',
          desc: 'Courier vehicle is on your local delivery route.'
        },
        delivered: {
          label: 'Delivered & Handed Over',
          desc: 'Doorstep arrival confirmed. Thank you for choosing Mira Studio.'
        }
      };

      return {
        ...order,
        status: nextStage,
        statusLabel: labels[nextStage]?.label || order.statusLabel,
        statusDescription: labels[nextStage]?.desc || order.statusDescription,
        timeline: updatedTimeline
      };
    }));
  }, []);

  const value = {
    orders,
    addOrder,
    getOrderById,
    advanceOrderStatus,
    totalOrders: orders.length
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
