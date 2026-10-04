import { getCurrentUser } from './auth'
import { prisma } from './db/client'
import { Role } from '@prisma/client'

export async function checkAdminOrEmployeePermission(requiredPermission?: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { authorized: false, error: 'Unauthorized', status: 401, user: null }
  }

  if (user.role === Role.ADMIN) {
    return { authorized: true, error: null, status: 200, user }
  }

  if (user.role === Role.EMPLOYEE) {
    if (!requiredPermission) {
      return { authorized: true, error: null, status: 200, user }
    }

    const perm = await prisma.employeePermission.findUnique({
      where: {
        userId_permission: {
          userId: user.id,
          permission: requiredPermission,
        },
      },
    })

    if (perm) {
      return { authorized: true, error: null, status: 200, user }
    }

    return { authorized: false, error: 'Forbidden: Insufficient employee permissions', status: 403, user }
  }

  return { authorized: false, error: 'Forbidden: Admin or authorized employee access required', status: 403, user }
}
