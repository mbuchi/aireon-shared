import { describe, expect, it } from 'vitest';
import { rankComparables } from '../comparables';

const refParcel = {
  lng: 8.5417,
  lat: 47.3769,
  properties: {
    parcel_id: 'self',
    estimated_price_m2: 8000,
    area_m2: 600,
    construction_zone: 'W3',
  },
};

describe('rankComparables', () => {
  it('skips the reference parcel itself', () => {
    const result = rankComparables({
      ref: refParcel,
      pool: [
        { ...refParcel },
        {
          lng: 8.5418,
          lat: 47.3770,
          properties: {
            parcel_id: 'a',
            estimated_price_m2: 7000,
            is_sell: true,
            area_m2: 580,
            construction_zone: 'W3',
          },
        },
      ],
    });
    expect(result.map((r) => r.parcelId)).toEqual(['a']);
  });

  it('filters out non-for-sale when onlyForSale=true (default)', () => {
    const result = rankComparables({
      ref: refParcel,
      pool: [
        {
          lng: 8.5418,
          lat: 47.3770,
          properties: { parcel_id: 'a', estimated_price_m2: 7000 },
        },
      ],
    });
    expect(result).toHaveLength(0);
  });

  it('includes non-for-sale when onlyForSale=false', () => {
    const result = rankComparables({
      ref: refParcel,
      pool: [
        {
          lng: 8.5418,
          lat: 47.3770,
          properties: { parcel_id: 'a', estimated_price_m2: 7000 },
        },
      ],
      onlyForSale: false,
    });
    expect(result).toHaveLength(1);
  });

  it('skips candidates without a price/m²', () => {
    const result = rankComparables({
      ref: refParcel,
      pool: [
        {
          lng: 8.5418,
          lat: 47.3770,
          properties: { parcel_id: 'a', is_sell: true },
        },
      ],
    });
    expect(result).toHaveLength(0);
  });

  it('ranks closer + same-zone parcels higher than far/different-zone', () => {
    const result = rankComparables({
      ref: refParcel,
      pool: [
        // Far away, different zone
        {
          lng: 8.6,
          lat: 47.4,
          properties: {
            parcel_id: 'far',
            estimated_price_m2: 7500,
            is_sell: true,
            area_m2: 600,
            construction_zone: 'I',
          },
        },
        // Close, same zone, similar size
        {
          lng: 8.5418,
          lat: 47.377,
          properties: {
            parcel_id: 'near',
            estimated_price_m2: 7800,
            is_sell: true,
            area_m2: 620,
            construction_zone: 'W3',
          },
        },
      ],
    });
    expect(result[0].parcelId).toBe('near');
  });

  it('respects the limit', () => {
    const pool = Array.from({ length: 8 }, (_, i) => ({
      lng: 8.5417 + i * 0.0001,
      lat: 47.3769,
      properties: {
        parcel_id: `p-${i}`,
        estimated_price_m2: 7000 + i * 100,
        is_sell: true,
        area_m2: 600,
      },
    }));
    const result = rankComparables({ ref: refParcel, pool, limit: 3 });
    expect(result).toHaveLength(3);
  });
});
