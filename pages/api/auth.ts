import { NextApiRequest, NextApiResponse } from 'next'
import { createUser, findUserByEmail, verifyPassword, setAuthCookie, clearAuthCookie } from '../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, name, mode } = req.body

    if (mode === 'register') {
      try {
        const existingUser = await findUserByEmail(email)
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' })
        }

        const user = await createUser(email, password, name)
        await setAuthCookie(res, user)

        return res.status(201).json({ id: user.id, email: user.email, name: user.name })
      } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error creating user' })
      }
    } else if (mode === 'login') {
      try {
        const user = await findUserByEmail(email)
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isValid = await verifyPassword(password, user.password)
        if (!isValid) {
          return res.status(401).json({ message: 'Invalid credentials' })
        }

        await setAuthCookie(res, user)

        return res.status(200).json({ id: user.id, email: user.email, name: user.name, role: user.role })
      } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error logging in' })
      }
    } else if (mode === 'logout') {
      await clearAuthCookie(res)
      return res.status(200).json({ message: 'Logged out successfully' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}