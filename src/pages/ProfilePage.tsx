import { useState } from 'react'
import {
    Mail,
    Building2,
    Plus,
    X,
    HelpCircle,
    ExternalLink,
    Lock,
    Globe
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { mockUser } from '@/services/mockData'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface ContactPerson {
    id: string
    name: string
    email: string
    phone?: string
    role: string
}

// Initial mock contacts
const initialContacts: ContactPerson[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@demoagency.com',
        phone: '+1 (555) 123-4567',
        role: 'Primary Contact'
    },
    {
        id: '2',
        name: 'Mike Johnson',
        email: 'mike@demoagency.com',
        role: 'Billing Contact'
    }
]

export function ProfilePage() {
    const [contacts, setContacts] = useState<ContactPerson[]>(initialContacts)
    const [isAddingContact, setIsAddingContact] = useState(false)
    const [newContact, setNewContact] = useState({ name: '', email: '', role: '' })

    const handleAddContact = () => {
        if (!newContact.name || !newContact.email) return

        const contact: ContactPerson = {
            id: Math.random().toString(36).substr(2, 9),
            name: newContact.name,
            email: newContact.email,
            role: newContact.role || 'Team Member'
        }

        setContacts([...contacts, contact])
        setNewContact({ name: '', email: '', role: '' })
        setIsAddingContact(false)
    }

    const removeContact = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id))
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Profile & Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account, company details, and preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="support">Support</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-6">
                    {/* Profile Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Overview</CardTitle>
                            <CardDescription>Your personal account details</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="" /> {/* Force fallback */}
                                <AvatarFallback className="text-2xl font-bold bg-[#dd3333]/10 text-[#dd3333]">
                                    {mockUser.email.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-semibold">John Doe</h3>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="font-normal">
                                        Admin
                                    </Badge>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">{mockUser.agency_name}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Persons */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Contact Persons</CardTitle>
                                <CardDescription>Manage team members who receive updates</CardDescription>
                            </div>
                            <Button onClick={() => setIsAddingContact(true)} size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Contact
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Primary User Info (Read Onlyish) */}
                            <div className="grid gap-4 md:grid-cols-2 bg-muted/30 p-4 rounded-lg border">
                                <div className="space-y-2">
                                    <Label>Your Name</Label>
                                    <Input value="John Doe" readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input value={mockUser.email} readOnly />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input value="+1 (555) 000-0000" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Job Title</Label>
                                    <Input value="Company Owner" />
                                </div>
                                <div className="md:col-span-2 pt-2">
                                    <Button variant="outline" className="gap-2">
                                        <Lock className="h-4 w-4" />
                                        Change Password
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Additional Contacts List */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-sm text-muted-foreground">Additional Contacts</h4>

                                {contacts.map((contact) => (
                                    <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                                {contact.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium">{contact.name}</p>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {contact.email}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{contact.role}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => removeContact(contact.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {isAddingContact && (
                                    <div className="p-4 rounded-lg border border-dashed bg-muted/30 space-y-4 animate-in fade-in zoom-in-95">
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input
                                                    placeholder="e.g. Alice Smith"
                                                    value={newContact.name}
                                                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    placeholder="alice@example.com"
                                                    value={newContact.email}
                                                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Role</Label>
                                                <Input
                                                    placeholder="e.g. Marketing Manager"
                                                    value={newContact.role}
                                                    onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" onClick={() => setIsAddingContact(false)}>Cancel</Button>
                                            <Button onClick={handleAddContact}>Save Contact</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agency Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Details</CardTitle>
                            <CardDescription>Information about your organization</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <Input value={mockUser.agency_name} readOnly />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Website URL</Label>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="https://www.demoagency.com" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="support" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Help & Support</CardTitle>
                            <CardDescription>Get assistance with your onboarding or dashboard</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-all">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Contact Support</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Need help? Our support team is available Mon-Fri to assist you with any questions.
                                    </p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href="mailto:team@datarevolt.agency">Email Support</a>
                                    </Button>
                                </div>

                                <div className="p-6 rounded-lg border bg-card hover:shadow-md transition-all">
                                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                        <HelpCircle className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-semibold mb-2">Documentation</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Browse our guides and resources to get the most out of your dashboard.
                                    </p>
                                    <Button variant="outline" className="w-full">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Guides
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
