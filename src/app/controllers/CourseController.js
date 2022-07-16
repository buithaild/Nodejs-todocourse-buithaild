// const e = require('express');
const Course = require('../models/Course');
const { mongoosesToObject } = require('../../util/mongoose');

class CourseController {

    // [GET] /courses//:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then(course =>
                res.render('courses/show', { course: mongoosesToObject(course) })
            )
            .catch(next);

    }

    // [GET] /courses/create
    create(req, res, next) {
        res.render('courses/create');
    }

    // [POST] /courses/store
    store(req, res, next) {

        req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCML-byK5TPhWN_-ZuZal4h5KasYw`
        const course = new Course(req.body);
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(error => {

            });


    }

    // [GET] /courses/:id/edit
    edit(req, res, next) {
        Course.findById(req.params.id)
            .then(courses => res.render('courses/edit', {
                courses: mongoosesToObject(courses)
            }))
            .catch(next)
    }


    // [PUT] /courses/:id
    update(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // [DELETE] /courses/:id
    delete(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /courses/:id/force
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


    // [PATCH] /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [POST] /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case 'delete':
                Course.delete({ _id: { $in: req.body.courseIds } })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action invalid!' })
        }
    }



}

module.exports = new CourseController();
