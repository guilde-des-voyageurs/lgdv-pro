import { Metadata } from "next"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Database } from "@/types/database.types"
import EditMemberForm from "@/components/admin/EditMemberForm"

export const metadata: Metadata = {
  title: "Modifier un membre | Administration",
  description: "Modifier les informations d&apos;un membre de La Guilde des Voyageurs",
}

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

async function getSupabase() {
  const cookieStore = await cookies()
  const cookiesList = cookieStore.getAll()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookiesList.find((c: { name: string }) => c.name === name)
          return cookie?.value ?? ""
        }
      }
    }
  )
  return supabase
}

async function checkAdminAccess() {
  const supabase = await getSupabase()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) redirect("/connexion")

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    redirect("/compte")
  }
}

async function getMemberData(id: string): Promise<Profile> {
  const supabase = await getSupabase()
  const { data: member, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", id)
    .single()

  if (error || !member) {
    redirect("/admin/membres")
  }

  return member
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const { id } = await props.params
  await checkAdminAccess()
  const member = await getMemberData(id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modifier un membre</h1>
        <p className="mt-2 text-gray-600">
          Modifiez les informations du membre et cliquez sur Enregistrer pour sauvegarder les changements.
        </p>
      </div>
      <EditMemberForm member={member} />
    </div>
  )
}
