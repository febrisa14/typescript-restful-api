import { AddressUnitTest } from "./unit/AddressUnitTest"
import { ContactUnitTest } from "./unit/ContactUnitTest"
import { UserUnitTest } from "./unit/UserUnitTest"

describe("Running All Unit Test", () => {
    UserUnitTest()
    ContactUnitTest()
    AddressUnitTest()
})