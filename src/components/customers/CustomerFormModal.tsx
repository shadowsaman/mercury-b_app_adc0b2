import React, { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { FormModal } from '@/components/shared/FormModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import type { Customer } from '@/types'
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers'

interface CustomerFormModalProps {
  open: boolean
  customer?: Customer | null
  onClose: () => void
}

const CUSTOMER_TYPES = ['Individual', 'Corporate', 'SME', 'VIP']
const KYC_STATUSES = ['Verified', 'Pending', 'Failed', 'Under Review', 'Not Started']
const AML_RISKS = ['Low', 'Medium', 'High', 'Critical']
const STATUSES = ['Active', 'Suspended', 'Under Review', 'Inactive']
const ID_TYPES = ['Passport', 'National ID', 'Driver License', 'Residence Permit']

export function CustomerFormModal({ open, customer, onClose }: CustomerFormModalProps) {
  const isEdit = !!customer

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [idType, setIdType] = useState('')
  const [kycStatus, setKycStatus] = useState('')
  const [amlRisk, setAmlRisk] = useState('')
  const [customerType, setCustomerType] = useState('')
  const [status, setStatus] = useState('')
  const [onboardingDate, setOnboardingDate] = useState('')
  const [photo, setPhoto] = useState('')

  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  useEffect(() => {
    if (customer) {
      setFullName(customer.full_name ?? '')
      setEmail(customer.email ?? '')
      setPhone(customer.phone ?? '')
      setDateOfBirth(customer.date_of_birth ?? '')
      setAddress(customer.address ?? '')
      setIdNumber(customer.id_number ?? '')
      setIdType(customer.id_type ?? '')
      setKycStatus(customer.kyc_status ?? '')
      setAmlRisk(customer.aml_risk_score ?? '')
      setCustomerType(customer.customer_type ?? '')
      setStatus(customer.status ?? '')
      setOnboardingDate(customer.onboarding_date ?? '')
      setPhoto(customer.photo ?? '')
    } else {
      setFullName('')
      setEmail('')
      setPhone('')
      setDateOfBirth('')
      setAddress('')
      setIdNumber('')
      setIdType('')
      setKycStatus('Pending')
      setAmlRisk('Low')
      setCustomerType('Individual')
      setStatus('Active')
      setOnboardingDate(new Date().toISOString().slice(0, 10))
      setPhoto('')
    }
  }, [customer, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit() {
    const payload: Partial<Customer> = {
      full_name: fullName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      date_of_birth: dateOfBirth || undefined,
      address: address || undefined,
      id_number: idNumber || undefined,
      id_type: idType || undefined,
      kyc_status: kycStatus || undefined,
      aml_risk_score: amlRisk || undefined,
      customer_type: customerType || undefined,
      status: status || undefined,
      onboarding_date: onboardingDate || undefined,
      photo: photo || undefined,
    }

    if (isEdit && customer) {
      updateMutation.mutate(
        { guid: customer.guid, ...payload },
        { onSuccess: () => onClose() }
      )
    } else {
      createMutation.mutate(payload, { onSuccess: () => onClose() })
    }
  }

  return (
    <FormModal
      open={open}
      title={isEdit ? 'Edit Customer' : 'Add Customer'}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel={isEdit ? 'Save Changes' : 'Create Customer'}
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234 567 8900"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-1.5">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        {/* Customer Type */}
        <div className="space-y-1.5">
          <Label>Customer Type</Label>
          <Select value={customerType} onValueChange={setCustomerType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CUSTOMER_TYPES.map((t) => (
                <SelectItem key={t} value={t || 'unknown'}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s || 'unknown'}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KYC Status */}
        <div className="space-y-1.5">
          <Label>KYC Status</Label>
          <Select value={kycStatus} onValueChange={setKycStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select KYC status" />
            </SelectTrigger>
            <SelectContent>
              {KYC_STATUSES.map((s) => (
                <SelectItem key={s} value={s || 'unknown'}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AML Risk */}
        <div className="space-y-1.5">
          <Label>AML Risk Score</Label>
          <Select value={amlRisk} onValueChange={setAmlRisk}>
            <SelectTrigger>
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              {AML_RISKS.map((r) => (
                <SelectItem key={r} value={r || 'unknown'}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ID Type */}
        <div className="space-y-1.5">
          <Label>ID Type</Label>
          <Select value={idType} onValueChange={setIdType}>
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {ID_TYPES.map((t) => (
                <SelectItem key={t} value={t || 'unknown'}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ID Number */}
        <div className="space-y-1.5">
          <Label htmlFor="id_number">ID Number</Label>
          <Input
            id="id_number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="AB123456"
          />
        </div>

        {/* Onboarding Date */}
        <div className="space-y-1.5">
          <Label htmlFor="onboarding_date">Onboarding Date</Label>
          <Input
            id="onboarding_date"
            type="date"
            value={onboardingDate}
            onChange={(e) => setOnboardingDate(e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, City, Country"
            rows={3}
          />
        </div>

        {/* Photo URL */}
        <div className="space-y-1.5">
          <Label htmlFor="photo">Photo URL</Label>
          <Input
            id="photo"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
    </FormModal>
  )
}
