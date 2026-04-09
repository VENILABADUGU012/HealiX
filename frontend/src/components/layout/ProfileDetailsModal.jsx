import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { loadUserProfile, saveUserProfile } from '../../utils/userProfileStorage'

function ProfileFormBody({ onClose }) {
  const [form, setForm] = useState(() => loadUserProfile())

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSave = () => {
    saveUserProfile(form)
    onClose()
  }

  return (
    <div className="max-h-[70vh] space-y-3 overflow-y-auto">
      <Input label="Name" value={form.name} onChange={set('name')} />
      <Input label="Email" type="email" value={form.email} onChange={set('email')} />
      <Input label="Phone" value={form.phone} onChange={set('phone')} />
      <Input label="Date of birth" type="date" value={form.dob} onChange={set('dob')} />
      <Input label="Gender" value={form.gender} onChange={set('gender')} />
      <Input label="Blood group" value={form.bloodGroup} onChange={set('bloodGroup')} />
      <Input label="Aadhar" value={form.aadhar} onChange={set('aadhar')} />
      <Input label="ABHA ID" value={form.abhaId} onChange={set('abhaId')} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}

function ProfileDetailsModal({ open, onClose }) {
  return (
    <Modal open={open} title="My details" onClose={onClose}>
      {open ? <ProfileFormBody onClose={onClose} /> : null}
    </Modal>
  )
}

export default ProfileDetailsModal
