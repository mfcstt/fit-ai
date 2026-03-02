import type { WeekDay } from "../../generated/prisma/enums";
import { prisma } from "../../lib/auth";
import type {
  CreateWorkoutPlanDTO,
  FindWorkoutDayOwnerDTO,
  FindWorkoutSessionOwnerDTO,
  StartWorkoutSessionDTO,
  UpdateWorkoutSessionDTO,
  WorkoutRepository,
} from "../workout-repository";

export class PrismaWorkoutRepository implements WorkoutRepository {
  async create(data: CreateWorkoutPlanDTO) {
    const workout = await prisma.workoutPlan.create({
      data: {
        name: data.name,
        user: { connect: { id: data.userId } },
        workoutDays: {
          create: data.workoutDays.map((day) => ({
            weekDay: day.weekDay as WeekDay,
            isRest: day.isRest,
            estimatedDurationInSeconds: day.estimatedDurationInSeconds,
            coverImageUrl: day.coverImageUrl,
            workoutExercises: {
              create: day.exercises,
            },
          })),
        },
      },
    });

    return { id: workout.id };
  }

  async findActiveByUserId(userId: string) {
    return prisma.workoutPlan.findFirst({
      where: {
        userId,
        isActive: true,
      },
      select: { id: true },
    });
  }

  async findWorkoutDayOwner(data: FindWorkoutDayOwnerDTO) {
    const workoutDay = await prisma.workoutDay.findFirst({
      where: {
        id: data.workoutDayId,
        workoutPlanId: data.workoutPlanId,
      },
      select: {
        workoutPlan: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!workoutDay) {
      return null;
    }

    return { userId: workoutDay.workoutPlan.userId };
  }

  async findStartedSessionByWorkoutDayId(workoutDayId: string) {
    return prisma.workoutSession.findFirst({
      where: {
        workoutDayId,
      },
      select: {
        id: true,
      },
    });
  }

  async startWorkoutSession(data: StartWorkoutSessionDTO) {
    const workoutSession = await prisma.workoutSession.create({
      data: {
        workoutDay: {
          connect: {
            id: data.workoutDayId,
          },
        },
        StartedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return { id: workoutSession.id };
  }

  async findWorkoutSessionOwner(data: FindWorkoutSessionOwnerDTO) {
    const workoutSession = await prisma.workoutSession.findFirst({
      where: {
        id: data.workoutSessionId,
        workoutDayId: data.workoutDayId,
        workoutDay: {
          workoutPlanId: data.workoutPlanId,
        },
      },
      select: {
        workoutDay: {
          select: {
            workoutPlan: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!workoutSession) {
      return null;
    }

    return {
      userId: workoutSession.workoutDay.workoutPlan.userId,
    };
  }

  async updateWorkoutSession(data: UpdateWorkoutSessionDTO) {
    const workoutSession = await prisma.workoutSession.update({
      where: {
        id: data.workoutSessionId,
      },
      data: {
        CompletedAt: data.completedAt,
      },
      select: {
        id: true,
        CompletedAt: true,
        StartedAt: true,
      },
    });

    return {
      id: workoutSession.id,
      completedAt: workoutSession.CompletedAt as Date,
      startedAt: workoutSession.StartedAt,
    };
  }
}
