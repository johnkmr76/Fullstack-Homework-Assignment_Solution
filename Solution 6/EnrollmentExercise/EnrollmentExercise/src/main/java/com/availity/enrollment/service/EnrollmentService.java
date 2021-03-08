package com.availity.enrollment.service;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URISyntaxException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.availity.enrollment.model.Enrollment;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

/**
 * This class has all the service methods to process enrollments in CSV file
 *
 */
public class EnrollmentService {
	private final String inputFile = "input.csv";

	/**
	 * Read input CSV file
	 * 
	 * @return list of enrollment
	 */
	public List<Enrollment> readFile() {
		try {
			CsvMapper csvMapper = new CsvMapper();
			csvMapper.disable(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY);
			MappingIterator<Enrollment> mi = csvMapper.readerWithTypedSchemaFor(Enrollment.class)
					.readValues(new File(this.getClass().getClassLoader().getResource(inputFile).toURI()));
			return mi.readAll();
		} catch (IOException | URISyntaxException e) {
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * Process Enrollments with following sequence and write the output CSV for
	 * given insurance company. 1. separate enrollees by insurance company in its
	 * own file 2. sort the contents of each file by last and first name (ascending)
	 * 3. if there are duplicate User Ids for the same Insurance Company, then only
	 * the record with the highest version should be included.
	 * 
	 * @param enrollments
	 */
	public void processEnrollment(List<Enrollment> enrollments) {
		Map<String, List<Enrollment>> groupedEnrollmentsByInsurance = groupByInsuranceCompanyWithDuplicatedUserId(
				enrollments);
		groupedEnrollmentsByInsurance.forEach((k, v) -> {
			v = getEnrollmentsByHighestVersion(v);
			v = getSortedEnrollmentsByLastAndFirstName(v);

			writeFile(k + ".csv", v);
		});
	}

	/**
	 * Write output CSV file
	 * 
	 * @param fileName
	 * @param enrollments
	 */
	public void writeFile(String fileName, List<Enrollment> enrollments) {
		try {
			CsvMapper csvMapper = new CsvMapper();
			csvMapper.disable(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY);
			CsvSchema schema = csvMapper.schemaFor(Enrollment.class).withColumnSeparator('|');
			File outputFile = new File(fileName);
			if (outputFile.exists()) {
				outputFile.delete();
			} else {
				outputFile.createNewFile();
			}
			ObjectWriter writer = csvMapper.writer(schema);
			OutputStream outstream = new FileOutputStream(outputFile, true);
			writer.writeValue(outstream, enrollments);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Sort enrollments by last and first name
	 * 
	 * @param enrollments
	 * @return sorted enrollments
	 */
	private List<Enrollment> getSortedEnrollmentsByLastAndFirstName(List<Enrollment> enrollments) {
		return enrollments.stream()
				.sorted(Comparator.comparing(Enrollment::getLastName).thenComparing(Enrollment::getFirstName))
				.collect(toList());
	}

	/**
	 * Group by InsuranceCompany for given userId
	 * 
	 * @param enrollments
	 * @return mapping of Insurance company with list of enrollments
	 */
	private Map<String, List<Enrollment>> groupByInsuranceCompanyWithDuplicatedUserId(List<Enrollment> enrollments) {
		return enrollments.stream().sorted(Comparator.comparing(Enrollment::getUserId))
				.collect(groupingBy(Enrollment::getInsuranceCompany));
	}

	/**
	 * Get Enrollments by highest version
	 * 
	 * @param enrollments
	 * @return list of enrollments
	 */
	private List<Enrollment> getEnrollmentsByHighestVersion(List<Enrollment> enrollments) {
		return enrollments.stream()
				.collect(groupingBy(Enrollment::getUserId,
						Collectors.maxBy(Comparator.comparing(Enrollment::getVersion))))
				.values().stream().map(Optional::get).collect(Collectors.toList());
	}
}
