import { useState, useEffect, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/store/toastStore'
import {
  getAddresses,
  addAddress,
  type Address,
} from '@/api/addresses.api'

// ─── Schema ───────────────────────────────────────────────────────────────────

const addressSchema = z.object({
  label:     z.enum(['home', 'work', 'other']),
  fullName:  z.string().min(2, 'Name is required'),
  phone:     z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit number'),
  line1:     z.string().min(3, 'Address line 1 is required'),
  line2:     z.string().optional(),
  city:      z.string().min(2, 'City is required'),
  state:     z.string().min(2, 'State is required'),
  pincode:   z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  isDefault: z.boolean(),
})

type AddressFormValues = z.infer<typeof addressSchema>

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  selectedId: string | null
  onSelect: (id: string) => void
  onContinue: () => void
}

// ─── Inline address form ──────────────────────────────────────────────────────

const InlineAddressForm: FC<{
  onClose?: () => void
  onSaved: (id: string) => void
}> = ({ onClose, onSaved }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addAddress,
    onSuccess: (addresses) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Address saved.')
      const saved = addresses[addresses.length - 1]
      if (saved) onSaved(saved._id)
    },
    onError: () => {
      toast.error('Could not save address.')
    },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'home', fullName: '', phone: '', line1: '', line2: '',
      city: '', state: '', pincode: '', isDefault: false,
    },
  })

  const closeForm = () => { reset(); onClose?.() }

  return (
    <div style={{
      background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
      padding: 24, marginBottom: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: 0 }}>
          New Address
        </p>
        {onClose && (
          <button onClick={closeForm} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6B6057' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={18} height={18}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(d => mutation.mutate(d))}>
        {/* Label */}
        <div style={{ marginBottom: 14 }}>
          <label className="acct-label">Label</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['home', 'work', 'other'] as const).map(opt => (
              <label key={opt} style={{
                display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                fontFamily: 'Jost', fontSize: 13, color: '#1C1A17', textTransform: 'capitalize',
              }}>
                <input type="radio" value={opt} {...register('label')} style={{ accentColor: '#7B5EA7' }} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label className="acct-label">Full Name</label>
            <input className="acct-input" type="text" placeholder="Full name" autoComplete="name" {...register('fullName')} />
            {errors.fullName && <p className="acct-error">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="acct-label">Phone</label>
            <input className="acct-input" type="tel" placeholder="10-digit number" maxLength={10} autoComplete="tel" {...register('phone')} />
            {errors.phone && <p className="acct-error">{errors.phone.message}</p>}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="acct-label">Address Line 1</label>
          <input className="acct-input" type="text" placeholder="Flat, House No., Building" autoComplete="address-line1" {...register('line1')} />
          {errors.line1 && <p className="acct-error">{errors.line1.message}</p>}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="acct-label">Address Line 2 (optional)</label>
          <input className="acct-input" type="text" placeholder="Area, Colony, Street" autoComplete="address-line2" {...register('line2')} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label className="acct-label">City</label>
            <input className="acct-input" type="text" placeholder="City" autoComplete="address-level2" {...register('city')} />
            {errors.city && <p className="acct-error">{errors.city.message}</p>}
          </div>
          <div>
            <label className="acct-label">State</label>
            <input className="acct-input" type="text" placeholder="State" autoComplete="address-level1" {...register('state')} />
            {errors.state && <p className="acct-error">{errors.state.message}</p>}
          </div>
          <div>
            <label className="acct-label">Pincode</label>
            <input className="acct-input" type="text" placeholder="6-digit" maxLength={6} autoComplete="postal-code" {...register('pincode')} />
            {errors.pincode && <p className="acct-error">{errors.pincode.message}</p>}
          </div>
        </div>

        <label style={{
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          fontFamily: 'Jost', fontSize: 13, color: '#1C1A17', marginBottom: 20,
        }}>
          <input type="checkbox" {...register('isDefault')} style={{ accentColor: '#7B5EA7', width: 16, height: 16 }} />
          Set as default address
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={mutation.isPending} className="acct-btn-gold">
            {mutation.isPending ? 'Saving…' : 'Save Address'}
          </button>
          {onClose && (
            <button type="button" onClick={closeForm} className="acct-btn-ghost">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

// ─── Address radio card ───────────────────────────────────────────────────────

const AddressRadioCard: FC<{
  address: Address
  selected: boolean
  onSelect: () => void
}> = ({ address, selected, onSelect }) => (
  <button
    onClick={onSelect}
    style={{
      display: 'block', width: '100%', textAlign: 'left',
      background: selected ? '#F0EAF7' : '#fff',
      border: selected ? '2px solid #7B5EA7' : '1px solid #E2DAC8',
      borderRadius: 6, padding: '16px 20px', cursor: 'pointer',
      transition: 'border-color 150ms, background 150ms',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 3,
        border: selected ? '5px solid #7B5EA7' : '2px solid #C4B89A',
        background: '#fff', transition: 'border 150ms',
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 10px', borderRadius: 10, border: '1px solid #C4B89A', color: '#6B6057',
            fontFamily: 'Jost', fontSize: 10, textTransform: 'capitalize', letterSpacing: '0.06em',
          }}>
            {address.label}
          </span>
          {address.isDefault && (
            <span style={{
              padding: '2px 10px', borderRadius: 10, border: '1px solid #C49A3C', color: '#C49A3C',
              fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              Default
            </span>
          )}
        </div>
        <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: '0 0 4px' }}>
          {address.fullName}
        </p>
        <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057', margin: 0, lineHeight: 1.7 }}>
          {address.line1}{address.line2 && `, ${address.line2}`}<br />
          {address.city}, {address.state} – {address.pincode}<br />
          {address.phone}
        </p>
      </div>
    </div>
  </button>
)

// ─── AddressStep ──────────────────────────────────────────────────────────────

const AddressStep: FC<Props> = ({ selectedId, onSelect, onContinue }) => {
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  })

  const [showForm, setShowForm] = useState(false)

  // Auto-select the default (or first) address once data loads
  useEffect(() => {
    if (addresses.length > 0 && !selectedId) {
      const def = addresses.find(a => a.isDefault) ?? addresses[0]
      onSelect(def._id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses])

  const handleSaved = (newId: string) => {
    onSelect(newId)
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {[1, 2].map(i => (
          <div key={i} style={{ background: '#fff', border: '1px solid #E2DAC8', borderRadius: 6, padding: '16px 20px' }} aria-hidden="true">
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#E2DAC8', flexShrink: 0, marginTop: 3 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: 60, height: 18, background: '#E2DAC8', borderRadius: 10, marginBottom: 10 }} />
                <div style={{ width: 140, height: 14, background: '#E2DAC8', borderRadius: 2, marginBottom: 8 }} />
                <div style={{ width: 200, height: 13, background: '#E2DAC8', borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Saved address list */}
      {addresses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          {addresses.map(addr => (
            <AddressRadioCard
              key={addr._id}
              address={addr}
              selected={selectedId === addr._id}
              onSelect={() => onSelect(addr._id)}
            />
          ))}
        </div>
      )}

      {/* Add new — show form directly when no saved addresses */}
      {addresses.length === 0 && !showForm ? (
        <InlineAddressForm onSaved={handleSaved} />
      ) : showForm ? (
        <InlineAddressForm
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', marginBottom: 24,
            background: 'none', border: '1px dashed #C4B89A', borderRadius: 6,
            padding: '12px 20px', cursor: 'pointer',
            fontFamily: 'Jost', fontSize: 12, color: '#7B5EA7',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            transition: 'border-color 150ms, background 150ms',
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span>
          Add New Address
        </button>
      )}

      {/* Continue */}
      <button
        onClick={onContinue}
        disabled={!selectedId}
        className="acct-btn-gold"
        style={{ width: '100%' }}
      >
        Continue to Review
      </button>
    </div>
  )
}

export default AddressStep
