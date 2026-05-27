import { useState, useRef, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AccountLayout from './AccountLayout'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { toast } from '@/store/toastStore'
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
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

// ─── Field component ──────────────────────────────────────────────────────────

const Field: FC<{
  label: string
  error?: string
  children: React.ReactNode
}> = ({ label, error, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label className="acct-label">{label}</label>
    {children}
    {error && <p className="acct-error">{error}</p>}
  </div>
)

// ─── Address form fields (shared between drawer and inline) ───────────────────

const AddressFields: FC<{
  register: ReturnType<typeof useForm<AddressFormValues>>['register']
  errors: ReturnType<typeof useForm<AddressFormValues>>['formState']['errors']
}> = ({ register, errors }) => (
  <>
    <Field label="Label" error={errors.label?.message}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
    </Field>

    <Field label="Full Name" error={errors.fullName?.message}>
      <input className="acct-input" type="text" placeholder="Full name" autoComplete="name" {...register('fullName')} />
    </Field>

    <Field label="Phone" error={errors.phone?.message}>
      <input className="acct-input" type="tel" placeholder="10-digit number" maxLength={10} autoComplete="tel" {...register('phone')} />
    </Field>

    <Field label="Address Line 1" error={errors.line1?.message}>
      <input className="acct-input" type="text" placeholder="Flat, House No., Building" autoComplete="address-line1" {...register('line1')} />
    </Field>

    <Field label="Address Line 2 (optional)" error={errors.line2?.message}>
      <input className="acct-input" type="text" placeholder="Area, Colony, Street" autoComplete="address-line2" {...register('line2')} />
    </Field>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <Field label="City" error={errors.city?.message}>
        <input className="acct-input" type="text" placeholder="City" autoComplete="address-level2" {...register('city')} />
      </Field>
      <Field label="State" error={errors.state?.message}>
        <input className="acct-input" type="text" placeholder="State" autoComplete="address-level1" {...register('state')} />
      </Field>
    </div>

    <Field label="Pincode" error={errors.pincode?.message}>
      <input className="acct-input" type="text" placeholder="6-digit pincode" maxLength={6} autoComplete="postal-code" {...register('pincode')} />
    </Field>

    <label style={{
      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
      fontFamily: 'Jost', fontSize: 13, color: '#1C1A17', marginBottom: 28,
    }}>
      <input type="checkbox" {...register('isDefault')} style={{ accentColor: '#7B5EA7', width: 16, height: 16 }} />
      Set as default address
    </label>
  </>
)

// ─── Address drawer ───────────────────────────────────────────────────────────

interface DrawerProps {
  open: boolean
  address: Address | null
  onClose: () => void
}

const BLANK_DEFAULTS: AddressFormValues = {
  label: 'home', fullName: '', phone: '', line1: '', line2: '',
  city: '', state: '', pincode: '', isDefault: false,
}

const AddressDrawer: FC<DrawerProps> = ({ open, address, onClose }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: AddressFormValues) =>
      address ? updateAddress(address._id, data) : addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success(address ? 'Address updated.' : 'Address saved.')
      onClose()
    },
    onError: () => {
      toast.error('Could not save address.')
    },
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: address
      ? { ...address }
      : BLANK_DEFAULTS,
  })

  const prevAddress = useRef(address)
  if (prevAddress.current !== address) {
    prevAddress.current = address
    reset(address ? { ...address } : BLANK_DEFAULTS)
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(28,26,23,0.45)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 250ms ease',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={address ? 'Edit Address' : 'Add New Address'}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
          width: 'min(400px, 100vw)',
          background: '#F5F0E8',
          boxShadow: '-4px 0 32px rgba(0,0,0,0.12)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 20px',
          borderBottom: '1px solid #E2DAC8',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#EDE8DC',
        }}>
          <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: 0 }}>
            {address ? 'Edit Address' : 'Add New Address'}
          </p>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6B6057' }}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={20} height={20}>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} style={{ padding: 24, flex: 1 }}>
          <AddressFields register={register} errors={errors} />
          <button type="submit" disabled={mutation.isPending} className="acct-btn-gold" style={{ width: '100%' }}>
            {mutation.isPending ? 'Saving…' : address ? 'Update Address' : 'Save Address'}
          </button>
        </form>
      </div>
    </>
  )
}

// ─── Confirm dialog ───────────────────────────────────────────────────────────

const ConfirmDialog: FC<{
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}> = ({ open, onConfirm, onCancel, loading }) => (
  <>
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(28,26,23,0.45)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 200ms',
      }}
    />
    <div style={{
      position: 'fixed', top: '50%', left: '50%', zIndex: 401,
      transform: open ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.95)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'transform 200ms, opacity 200ms',
      background: '#fff', borderRadius: 8, border: '1px solid #E2DAC8',
      padding: '28px 32px', width: 'min(360px, 90vw)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    }}>
      <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400, fontSize: 20, color: '#1C1A17', margin: '0 0 8px' }}>
        Delete Address?
      </p>
      <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057', margin: '0 0 24px' }}>
        This address will be permanently removed.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} className="acct-btn-ghost">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="acct-btn-danger">
          {loading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </>
)

// ─── Address card skeleton ────────────────────────────────────────────────────

const AddressCardSkeleton: FC = () => (
  <div style={{
    background: '#fff', border: '1px solid #E2DAC8', borderRadius: 6,
    padding: '18px 20px',
  }} aria-hidden="true">
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <Skeleton width="60px" height="20px" />
    </div>
    <div style={{ marginBottom: 8 }}>
      <Skeleton width="150px" height="14px" />
    </div>
    <div style={{ marginBottom: 6 }}>
      <Skeleton width="220px" height="13px" />
    </div>
    <Skeleton width="180px" height="13px" />
  </div>
)

// ─── Address card ─────────────────────────────────────────────────────────────

const AddressCard: FC<{
  address: Address
  onEdit: () => void
  onDelete: () => void
}> = ({ address, onEdit, onDelete }) => (
  <div style={{
    background: '#fff', border: '1px solid #E2DAC8', borderRadius: 6,
    padding: '18px 20px', position: 'relative',
  }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: 10,
            border: '1px solid #C4B89A', color: '#6B6057',
            fontFamily: 'Jost', fontSize: 10, textTransform: 'capitalize', letterSpacing: '0.06em',
          }}>
            {address.label}
          </span>
          {address.isDefault && (
            <span style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: 10,
              border: '1px solid #C49A3C', color: '#C49A3C',
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
          {address.line1}
          {address.line2 && `, ${address.line2}`}
          <br />
          {address.city}, {address.state} – {address.pincode}
          <br />
          {address.phone}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={onEdit}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#7B5EA7' }}
          aria-label="Edit address"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={16} height={16}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#A85050' }}
          aria-label="Delete address"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={16} height={16}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)

// ─── AddressesPage ────────────────────────────────────────────────────────────

const AddressesPage: FC = () => {
  const queryClient = useQueryClient()

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Address deleted.')
      setDeleteTarget(null)
    },
    onError: () => {
      toast.error('Could not delete address.')
    },
  })

  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [editTarget, setEditTarget]     = useState<Address | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null)

  const openAdd  = () => { setEditTarget(null); setDrawerOpen(true) }
  const openEdit = (a: Address) => { setEditTarget(a); setDrawerOpen(true) }

  return (
    <AccountLayout activeTab="addresses">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p className="acct-eyebrow">✦ Addresses</p>
          <h1 className="acct-page-title">Saved Addresses</h1>
        </div>
        <button onClick={openAdd} className="acct-btn-gold">+ Add Address</button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3].map(i => <AddressCardSkeleton key={i} />)}
        </div>
      ) : addresses.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width={40} height={40}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
          title="No saved addresses"
          description="Add an address to speed up checkout"
          actionLabel="Add Address"
          onAction={openAdd}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {addresses.map(a => (
            <AddressCard
              key={a._id}
              address={a}
              onEdit={() => openEdit(a)}
              onDelete={() => setDeleteTarget(a)}
            />
          ))}
        </div>
      )}

      <AddressDrawer
        open={drawerOpen}
        address={editTarget}
        onClose={() => setDrawerOpen(false)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMutation.isPending}
      />
    </AccountLayout>
  )
}

export default AddressesPage
