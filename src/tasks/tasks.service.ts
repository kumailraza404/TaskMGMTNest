import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';



@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks() {
        return this.tasks;
    }

    getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter((task) => task.status === status)
        }
        if (search) {
            tasks = tasks.filter((task) => task.title.includes(search) || task.description.includes(search))
        }
        return tasks
    }

    getTaskById(id: string): Task {
        const res = this.tasks.find((task) => task.id === id)

        if (!res) {
            throw new NotFoundException()
        }
        return res
    }

    updateTask(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id)
        task.status = status
        return task;
    }

    deleteTask(id: string): Task[] {
        const res = this.getTaskById(id);
        this.tasks = this.tasks.filter((task) => task.id !== res.id)
        return this.tasks
    }

    createTask(createTaskDto: CreateTaskDto): Task {

        const { title, description } = createTaskDto;
        const task: Task = {
            title,
            description,
            status: TaskStatus.OPEN,
            id: uuid()
        }
        this.tasks.push(task);
        return task;
    }
}
