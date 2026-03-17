"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const uuid_1 = require("uuid");
class ProjectManager {
    projects = new Map();
    taskQueue;
    constructor(taskQueue) {
        this.taskQueue = taskQueue;
    }
    async createProject(request) {
        const project = {
            id: (0, uuid_1.v4)(),
            name: request.name,
            description: request.description,
            documentation: request.documentation,
            status: 'planning',
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.projects.set(project.id, project);
        await this.createTask({
            projectId: project.id,
            title: 'Analizar documentación del proyecto',
            description: `Analiza la siguiente documentación y crea un plan de trabajo:\n\n${request.documentation}`,
            assignedTo: 'lead',
            requiresApproval: true
        });
        return project;
    }
    async createTask(request) {
        const project = this.projects.get(request.projectId);
        if (!project) {
            throw new Error(`Proyecto no encontrado: ${request.projectId}`);
        }
        const task = {
            id: (0, uuid_1.v4)(),
            projectId: request.projectId,
            title: request.title,
            description: request.description,
            assignedTo: request.assignedTo,
            status: 'pending',
            dependencies: request.dependencies || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            requiresApproval: request.requiresApproval || false
        };
        project.tasks.push(task);
        project.updatedAt = new Date();
        await this.taskQueue.addTask(task);
        return task;
    }
    getProject(id) {
        return this.projects.get(id);
    }
    getAllProjects() {
        return Array.from(this.projects.values());
    }
    updateTaskStatus(taskId, status, result) {
        for (const project of this.projects.values()) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = status;
                task.updatedAt = new Date();
                if (status === 'completed') {
                    task.completedAt = new Date();
                    task.result = result;
                    this.checkProjectCompletion(project);
                }
                break;
            }
        }
    }
    checkProjectCompletion(project) {
        const allCompleted = project.tasks.every(t => t.status === 'completed');
        const hasFailed = project.tasks.some(t => t.status === 'failed');
        if (allCompleted) {
            project.status = 'completed';
        }
        else if (hasFailed) {
            project.status = 'failed';
        }
        project.updatedAt = new Date();
    }
    async createSubtasksFromLead(projectId, leadAnalysis) {
        const project = this.projects.get(projectId);
        if (!project)
            return;
        const subtasks = [
            {
                projectId,
                title: 'Diseñar arquitectura de base de datos',
                description: 'Crear esquema de base de datos y migraciones',
                assignedTo: 'backend',
                requiresApproval: false
            },
            {
                projectId,
                title: 'Implementar API REST',
                description: 'Crear endpoints CRUD para el recurso principal',
                assignedTo: 'backend',
                requiresApproval: false
            },
            {
                projectId,
                title: 'Crear componentes de UI',
                description: 'Implementar formularios y listados en React',
                assignedTo: 'frontend',
                requiresApproval: false
            },
            {
                projectId,
                title: 'Escribir post de lanzamiento',
                description: 'Crear contenido para LinkedIn sobre el proyecto',
                assignedTo: 'content',
                requiresApproval: true
            },
            {
                projectId,
                title: 'Revisar código y seguridad',
                description: 'Auditar implementación para bugs y vulnerabilidades',
                assignedTo: 'qa',
                requiresApproval: false
            }
        ];
        for (const subtask of subtasks) {
            await this.createTask(subtask);
        }
        project.status = 'in_progress';
        project.updatedAt = new Date();
    }
}
exports.ProjectManager = ProjectManager;
//# sourceMappingURL=projectManager.js.map