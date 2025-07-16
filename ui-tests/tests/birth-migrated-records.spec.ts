import { test, expect, type Page } from "@playwright/test";
import { loginToV2 } from "../helpers";
import { CREDENTIALS } from "../constants";

test.describe.serial("1. Verify migrated birth record", () => {
  const recordId = ""; // Figure out a way to fetch migrated record ID's
  const oldUrl = `http://localhost:3000/${recordId}/viewRecord?V2_EVENTS=false`;
  const newUrl = `http://localhost:3000/events/view/${recordId}?V2_EVENTS=true`;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await loginToV2(page, CREDENTIALS.LOCAL_REGISTRAR);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.describe("1.1 Detect errors in migrated records", async () => {
    test("1.1.1 Detect invalid inputs in migrated record (indicates a mismatch in data type during migration)", async () => {
      await page.goto(newUrl);
      await expect(page.getByText("Birth declaration")).toBeVisible();
      await expect(page.getByText(/Invalid input/i)).toHaveCount(0);
    });
    test("1.1.2 Detect required fields in migrated record (indicates possibly overlooked form fields during migration)", async () => {
      await page.goto(newUrl);
      await expect(page.getByText("Birth declaration")).toBeVisible();
      await expect(page.getByText(/Required/i)).toHaveCount(0);
    });
  });

  test.describe("1.2 Declaration Review - Child's details section", async () => {
    const childDetails = {};
    test("1.2.1 Capture V1 Child's details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Birth Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#child-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #child-content:", ids);

      const mappingsChildDetails = {
        Full: "child.name",
        Sex: "child.gender",
        Date: "child.dob",
        Place: "child.placeOfBirth",
        Attendant: "child.attendantAtBirth",
        Type: "child.birthType",
        Weight: "child.weightAtBirth",
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#child-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsChildDetails[id];
        if (v2Field) {
          childDetails[v2Field] = value;
        }
      }
      //console.log("birth V1 childDetails", childDetails);
    });
    test.skip("1.2.2 Compare V2 Child's details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(childDetails)) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
  });

  test.describe("1.3 Declaration Review - Informant's details section", async () => {
    const informantDetails = {};
    test("1.3.1 Capture V1 Informant details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Birth Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#informant-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #informant-content:", ids);

      const mappingsInformantDetails = {
        Relationship: "informant.relation",
        Phone: "informant.phoneNo",
        Email: "informant.email",
        Full: "informant.name",
        Date: "informant.dob",
        Nationality: "informant.nationality",
        Type: "informant.idType",
        ID: "informant.passport"
        /* Same: "informant.addressSameAs", */
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#informant-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsInformantDetails[id];
        if (v2Field) {
          informantDetails[v2Field] = value;
        }
      }
      //console.log("birth V1 informantDetails", informantDetails);
    });
    test.skip("1.3.2 Compare V2 Informant details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(
        informantDetails
      )) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
  });

  test.describe("1.4 Declaration Review - Mother's details section", async () => {
    const motherDetails = {};
    test("1.4.1 Capture V1 Mother's details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Birth Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#mother-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #mother-content:", ids);

      const mappingsMotherDetails = {
        Full: "mother.name",
        Date: "mother.dob",
        Nationality: "mother.nationality",
        Type: "mother.idType",
        ID: "mother.passport",
        Usual: "mother.address",
        Marital: "mother.maritalStatus",
        Level: "mother.educationalAttainment",
        Occupation: "mother.occupation",
        "No.": "mother.previousBirths"
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#mother-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsMotherDetails[id];
        if (v2Field) {
          motherDetails[v2Field] = value;
        }
      }
      //console.log("birth V1 motherDetails", motherDetails);
    });
    test.skip("1.4.2 Compare V2 Mother's details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(
        motherDetails
      )) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
  });

  test.describe("1.5 Declaration Review - Father's details section", async () => {
    const fatherDetails = {};
    test("1.5.1 Capture V1 Father details", async () => {
      await page.goto(oldUrl);
      await expect(
        page.getByText("Birth Declaration", { exact: true })
      ).toBeVisible();

      const ids = await page.evaluate(() => {
        const container = document.querySelector("#father-content");
        if (!container) return [];
        return Array.from(container.querySelectorAll("[id]")).map(
          (el) => el.id
        );
      });

      //console.log("IDs inside #father-content:", ids);

      const mappingsFatherDetails = {
        Full: "father.name",
        Date: "father.dob",
        Nationality: "father.nationality",
        Type: "father.idType",
        ID: "father.passport",
        Same: "father.addressSameAs",
        Marital: "father.maritalStatus",
        Level: "father.educationalAttainment",
        Occupation: "father.occupation",
      };

      for (const id of ids) {
        // Escape special characters in id (like ".")
        const safeId = id.replace(/\./g, "\\.");
        const value = await page
          .locator(`#father-content #${safeId}`)
          .locator("td:nth-child(2)")
          .textContent();
        const v2Field = mappingsFatherDetails[id];
        if (v2Field) {
          fatherDetails[v2Field] = value;
        }
      }
      //console.log("birth V1 fatherDetails", fatherDetails);
    });
    test.skip("1.5.2 Compare V2 Father details", async () => {
      const errors: string[] = [];
      await page.goto(newUrl);

      for (const [fieldName, v1FieldValue] of Object.entries(fatherDetails)) {
        const v2FieldValue = await page
          .getByTestId(`row-value-${fieldName}`)
          .textContent();
        if (v2FieldValue !== v1FieldValue) {
          errors.push(`Mismatch in ${fieldName} field`);
        }
      }
      if (errors.length > 0) {
        throw new Error("Assertion failures:\n" + errors.join("\n"));
      }
    });
  });
});
