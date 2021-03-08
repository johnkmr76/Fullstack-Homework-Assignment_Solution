package com.availity.enrollment;

import java.util.List;

import com.availity.enrollment.model.Enrollment;
import com.availity.enrollment.service.EnrollmentService;

public class Application {

	public static void main(String[] args) {
		EnrollmentService enrollmentService = new EnrollmentService();
		List<Enrollment> enrollments = enrollmentService.readFile();
		enrollmentService.processEnrollment(enrollments);
	}
}
