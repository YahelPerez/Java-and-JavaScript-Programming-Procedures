# Sprint 2: Technical Challenges and Solutions

## Project Context
Module: **Graph-based City Network Visualization**  
Technology Stack: JavaScript (Node.js), Jest Testing Framework  
Coverage Achieved: **100% Statements, 98.52% Branches, 100% Functions, 100% Lines**

---

## Main Technical Challenges

### 1. Bidirectional Edge Management
**Challenge:**  
Implementing a weighted undirected graph where edges between cities are bidirectional posed the challenge of maintaining consistency—adding a distance between City A and City B should automatically make it available in both directions without duplicating data storage.

**Solution:**  
- Created a private `getEdgeKey(city1, city2)` method that generates order-independent keys using alphabetical sorting
- Stored each edge only once in the `edges` Map using the normalized key
- Both `addDistance()` and `getDistance()` use this method to ensure consistent lookup regardless of parameter order
- This approach reduced memory usage by 50% compared to storing edges in both directions

```javascript
getEdgeKey(city1, city2) {
  return [city1, city2].sort().join('|');
}
```

### 2. Comprehensive Input Validation
**Challenge:**  
JavaScript's dynamic typing and flexible input handling required extensive validation to prevent invalid data from corrupting the graph structure. Edge cases included: null, undefined, empty strings, whitespace-only strings, non-string types, NaN, Infinity, negative numbers, and zero distances.

**Solution:**  
- Implemented multi-layered validation in `addCity()`:
  - Type checking: `typeof cityName !== 'string'`
  - Null/undefined checking: `!cityName`
  - Whitespace validation: `trim().length === 0`
- Implemented comprehensive validation in `addDistance()`:
  - Type checking for numbers
  - Range validation (positive numbers only)
  - Special number validation (`isNaN()`, `isFinite()`)
  - Self-loop prevention
  - Duplicate edge detection
- All validation errors throw descriptive Error objects with clear messages
- Created 58 unit tests with 18 dedicated to testing error conditions

### 3. Connection Management During City Removal
**Challenge:**  
When removing a city from the graph, all edges connected to that city must also be removed to maintain graph integrity. The challenge was efficiently identifying and removing all relevant connections without leaving orphaned edges.

**Solution:**  
- Stored connections as an array within each city object: `{ name, connections: [] }`
- On `removeCity()`, iterate through all the city's connections
- For each connected city, remove the reverse connection using `filter()`
- Delete all edges involving the removed city using the `getEdgeKey()` method
- This ensures complete cleanup and prevents memory leaks

```javascript
removeCity(cityName) {
  const cityData = this.cities.get(normalizedName);
  
  // Remove all edges involving this city
  cityData.connections.forEach(connectedCity => {
    // Remove reverse connection
    const otherCityData = this.cities.get(connectedCity);
    otherCityData.connections = otherCityData.connections.filter(c => c !== normalizedName);
    
    // Remove edge
    this.edges.delete(this.getEdgeKey(normalizedName, connectedCity));
  });
  
  return this.cities.delete(normalizedName);
}
```

### 4. Efficient Nearby Cities Query
**Challenge:**  
The `getNearbyCities(cityName, maxDistance)` method needed to filter cities by distance threshold and return results sorted by proximity, requiring both filtering and sorting operations on potentially large datasets.

**Solution:**  
- Leveraged the pre-stored `connections` array for O(n) iteration where n = number of connections (not total cities)
- Used `filter()` to remove cities beyond maxDistance
- Used `sort()` with custom comparator for distance-based ordering
- Avoided unnecessary graph traversal by only checking direct connections
- Result: O(n log n) time complexity where n = connected cities only

```javascript
getNearbyCities(cityName, maxDistance) {
  return cityData.connections
    .map(connectedCity => ({
      city: connectedCity,
      distance: this.getDistance(normalizedName, connectedCity)
    }))
    .filter(item => item.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}
```

### 5. Test Coverage for Edge Cases
**Challenge:**  
Achieving 90%+ code coverage required testing not just the happy path but also numerous edge cases, error conditions, and boundary scenarios. This was particularly challenging for methods with multiple validation layers.

**Solution:**  
- Organized tests into logical groups using Jest's `describe()` blocks
- Created separate test suites for:
  - City Management (19 tests)
  - Distance Management (17 tests)
  - Nearby Cities queries (12 tests)
  - Utility methods (8 tests)
  - Integration tests (2 tests)
- Used `beforeEach()` hooks to set up clean test state
- Employed parameterized testing patterns for validation scenarios
- Achieved **100% statement, function, and line coverage**, with only one uncovered branch (line 209)

### 6. CommonJS Module Pattern
**Challenge:**  
Ensuring the Graph class works correctly with Jest's testing environment required proper module exports while maintaining clean class-based architecture.

**Solution:**  
- Used `module.exports = Graph;` for CommonJS compatibility
- Enabled Jest to import the class with `require()`
- Maintained ES6 class syntax for clean, modern JavaScript
- All methods accessible through prototype chain
- No need for Babel transpilation in test environment

---

## Testing Strategy

### Test Distribution
- **Positive Tests (24):** Verify correct behavior with valid inputs
- **Negative Tests (18):** Validate error handling for invalid inputs
- **Edge Case Tests (14):** Check boundary conditions and special scenarios
- **Integration Tests (2):** Test complex multi-operation workflows

### Key Test Patterns
1. **Validation Testing:** Every error condition has a dedicated test
2. **Bidirectional Testing:** Distance queries tested in both directions
3. **State Verification:** Tests verify both return values and internal state changes
4. **Cleanup Testing:** Removal operations verify complete cleanup
5. **Sorting Verification:** Nearby cities tests verify correct ordering

---

## Performance Considerations

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| addCity() | O(1) | O(1) |
| addDistance() | O(1) | O(1) |
| removeCity() | O(k) where k = connections | O(1) |
| getDistance() | O(1) | O(1) |
| getNearbyCities() | O(n log n) where n = connections | O(n) |
| getAllCities() | O(m) where m = total cities | O(m) |

**Key Optimization:** Using Map data structure instead of plain objects provides O(1) average-case lookup for cities and edges.

---

## Lessons Learned

1. **Defensive Programming:** JavaScript's flexibility requires extensive input validation at every public method boundary
2. **Test-Driven Development:** Writing tests alongside implementation helped catch edge cases early
3. **Data Structure Choice:** Map provides better performance and cleaner API than plain objects for dynamic key-value storage
4. **Error Messages Matter:** Descriptive error messages significantly improve debugging experience
5. **Bidirectional Relationships:** Order-independent keys are essential for undirected graph implementations

---

## Sprint 2 Deliverables Summary
✅ Graph module with full CRUD operations  
✅ 58 comprehensive unit tests  
✅ 100% statement coverage (exceeds 90% requirement)  
✅ Robust error handling and validation  
✅ Professional technical documentation  
✅ Ready for production use

**Total Test Execution Time:** ~2 seconds  
**Final Coverage:** 100% Statements | 98.52% Branches | 100% Functions | 100% Lines
