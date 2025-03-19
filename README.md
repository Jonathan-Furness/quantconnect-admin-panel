# QuantConnect Admin Panel

A comprehensive admin interface for managing and interacting with live trading
algorithms hosted on QuantConnect. This project does not have any affiliation
with QuantConnect.

## Overview

The Admin Panel provides a centralised interface for managing live algorithmic
trading strategies deployed on the QuantConnect platform. It offers tools to
interact with live algorithms, allowing you to trigger a portfolio rebalance,
update trading parameters, or any other task you may want to complete.

## Features

- **Command Interface**: Send real-time commands to your live algorithms
  - Execute trades, adjust parameters, and control algorithm behavior
  - Interface with QuantConnect's Command API
  - Predefined command templates for common operations

## Upcoming Features

- **Performance Analytics**: Comprehensive performance metrics and
  visualizations
  - P&L tracking across strategies
  - Drawdown analysis
  - Risk metrics (Sharpe, Sortino, etc.)
- **Live Monitoring**: Real-time status and activity monitoring of your
  algorithms
  - Track execution and order status
  - Monitor algorithm health and connectivity
- **Alert System**: Customizable alerts for critical events
  - Performance thresholds
  - Trading errors
  - Market condition changes

## Architecture

This project is built as a Turborepo monorepo with TypeScript. The reason for
the monorepo structure, is to allow flexibility for extending the functionality
in the future. I plan to create a plugin style system for adding functionality
depending on your needs.

The admin panel takes advantage of [Payload CMS](https://payloadcms.com). This
allows an intuitive way of setting up database tables and schemas allowing for a
primary focus on functionality and speed.

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Jonathan-Furness/quantconnect-admin-panel.git
cd quantconnect-admin-panel

# Install dependencies
pnpm install

# Set up environment variables
cd apps/backend
cp .env.example .env.local
```

Configure your `.env.local` file.

### Database Setup

This project uses [Payload CMS](https://payloadcms.com) which requires a
database. Two options are supported:

#### PostgreSQL (Default)

The project is pre-configured for PostgreSQL:

1. Install PostgreSQL on your system
2. Create a database for the project
3. Update your `.env.local` with PostgreSQL connection details:
   ```
    DB_PASSWORD="postgres"
    DB_USER="postgres"
    DB_HOST="localhost"
    DB_PORT=54322
    DB_NAME="postgres"
   ```

Note: In development mode, the project automatically spins up a Supabase
instance that provides a PostgreSQL database. This makes local development
easier without requiring a separate database setup.

#### MongoDB

To use MongoDB instead:

1. Install MongoDB on your system
2. Create a MongoDB database
3. Install the MongoDB adapter:
   ```bash
   pnpm add @payloadcms/db-mongodb
   ```
4. Update your configuration in `apps/backend/src/payload.config.ts` to use the
   MongoDB adapter
5. Configure your `.env.local` with MongoDB connection string:
   ```
    DB_PASSWORD="super-secret"
    DB_USER="mongo"
    DB_HOST="localhost"
    DB_PORT=27017
    DB_NAME="qc-admin-panel"
   ```

Refer to
[Payload's database documentation](https://payloadcms.com/docs/database/overview)
for more details.

### Development

```bash
# Start the development server
pnpm dev
```

### Building for Production

```bash
# Build all packages and applications
pnpm build

# Start the production server
pnpm start
```

## Usage

### Creating and Managing Strategies

1. Navigate to the "Strategies" collection in the admin panel
2. Create a new strategy and provide the required information:
   - Strategy name
   - Project ID (from QuantConnect)
   - Start date
   - Base currency

### Setting Up Commands

1. In the "Commands" tab, create a new command
2. Define the command schema according to your algorithm's requirements
3. To run a command, click the action button which will display a form for input
   parameters
4. Fill in the required details (note that the `$type` label defines the name of
   the command you're executing)

### Connecting to QuantConnect

1. Configure your QuantConnect API credentials by including them as environment
   variables:

```
QC_API_TOKEN="quantconnect-api-token"
QC_USER_ID="quantconnect-user-id"
```

### Sending Commands to Live Algorithms

1. Select the algorithm from your deployed algorithms list
2. Choose a command type from the available commands
3. Configure command parameters
4. Send the command and view results in real-time

### Setting Up Commands in Your Algorithm

To utilise the command functionality, you need to implement command handlers in
your QuantConnect algorithms. You can read more about the Command API in the
[QuantConnect Docs](https://www.quantconnect.com/docs/v2/writing-algorithms/live-trading/commands)

```python
class EncapsulatedCommandAlgorithm(QCAlgorithm):

    def initialize(self):
        MyCommand.ALGORITHM = self
        self.add_command(MyCommand)
        self.set_benchmark(lambda x: 1) # So the algorithm doesn't need asset data.

    def do_something(self):
        self.log('Something was done!')

class MyCommand(Command):
    ALGORITHM = None
    ticker = None
    quantity = None
    parameters = {}

    def run(self, algorithm):
        algorithm.log(f"ticker: {self.ticker}; quantity: {self.quantity}; parameters: {self.parameters}")
        MyCommand.ALGORITHM.do_something()
        return True
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request with any
features you want adding.

## License

[MIT](LICENSE)

## Acknowledgements

- [QuantConnect](https://www.quantconnect.com/) for their algorithmic trading
  platform
- [Turborepo](https://turbo.build/repo) for the monorepo structure
- [Next.js](https://nextjs.org/) for the web framework
