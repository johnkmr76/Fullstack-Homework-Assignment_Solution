package com.schneider.ci2;

/**
 * This class validates the parentheses of a LISP code.
 *
 */
public class LISPChecker {

	private static final String regexParentheses = "[^()]";

	private static final String checkParentheses = "\\(\\)";

	public static void main(String[] args) {
		System.out.println(check("(TestString)") ? "Valid" : "Invalid");
		System.out.println(check("") ? "Valid" : "Invalid");
		System.out.println(check(")") ? "Valid" : "Invalid");
		System.out.println(check(null) ? "Valid" : "Invalid");
		System.out.println(check("(Test]") ? "Valid" : "Invalid");
		System.out.println(check("Te(st)String") ? "Valid" : "Invalid");
	}

	/**
	 * 
	 * @param inputString - input string to check
	 * @return returns true if all the parentheses in the string are properly closed
	 *         and nested else false
	 */
	private static boolean check(String inputString) {
		// Validate the input String
		if (inputString == null || inputString.isEmpty()
				|| (!inputString.contains("(") && !inputString.contains(")"))) {
			return false;
		}

		String value = inputString.replaceAll(regexParentheses, "");

		while (value.contains("()")) {
			value = value.replaceAll(checkParentheses, "");
		}

		return (value.length() == 0);
	}
}
