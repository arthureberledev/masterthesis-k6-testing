@REM SMOKE TESTS IN LOCAL ENVIRONMENT
@REM k6 run -e TEST_TO_RUN=smoke -e ARCHITECTURE_TO_RUN=local multi-scenario.js 
@REM k6 run -e TEST_TO_RUN=smoke -e ARCHITECTURE_TO_RUN=monolithic multi-scenario.js 
@REM k6 run -e TEST_TO_RUN=smoke -e ARCHITECTURE_TO_RUN=serverless multi-scenario.js 

@REM STRESS TESTS IN CLOUD ENVIRONMENT
@REM k6 cloud -e TEST_TO_RUN=stress -e ARCHITECTURE_TO_RUN=local multi-scenario.js 
@REM k6 cloud -e TEST_TO_RUN=stress -e ARCHITECTURE_TO_RUN=monolithic multi-scenario.js 
@REM k6 cloud -e TEST_TO_RUN=stress -e ARCHITECTURE_TO_RUN=serverless multi-scenario.js 