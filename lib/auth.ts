import { hash, compare } from 'bcryptjs'
import prisma from './db'
import { Role, User } from '@prisma/client'
import { serialize } from 'cookie'
import { NextApiResponse } from 'next'
import { parseCookies } from 'nookies'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'


const SALT_ROUNDS = 12

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function createUser(email: string, password: string, name?: string, role: Role = 'CUSTOMER') {
  const hashedPassword = await hashPassword(password)
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    }
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

export async function setAuthCookie(res: NextApiResponse, user: User) {
  const cookie = serialize('auth', JSON.stringify({ id: user.id, email: user.email, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

export async function clearAuthCookie(res: NextApiResponse) {
  const cookie = serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

export async function getAuthUser(req: any) {
  const cookies = parseCookies({ req })
  if (!cookies.auth) return null

  try {
    const authData = JSON.parse(cookies.auth)
    return await prisma.user.findUnique({
      where: { id: authData.id },
      select: { id: true, email: true, name: true, role: true }
    })
  } catch (error) {
    return null
  }
}

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      const cookies = parseCookies()
      if (!cookies.auth) {
        setLoading(false)
        return
      }

      try {
        const authData = JSON.parse(cookies.auth)
        const cartRes = await fetch('/api/cart')
        const cartItems = await cartRes.json()
        
        setUser({
          ...authData,
          cartCount: cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
        })
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const logout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'logout' })
      })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  return { user, loading, logout }
}